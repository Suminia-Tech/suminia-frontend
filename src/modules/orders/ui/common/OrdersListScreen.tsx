'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Package } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { PageHeader, Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetOrdersQuery } from '../../api/ordersApi';
import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
} from '../../lib/orderStatus';
import type { OrderStatus } from '../../model/order.types';

/* Los pedidos: los que hizo la empresa si es compradora, los que le hicieron si
   es proveedora, y todos si quien mira es personal de Suminia.

   Es una sola pantalla para los tres porque la lista es la misma —numero, la
   otra empresa, fecha, estado y total— y lo que cambia es a quien se nombra y a
   donde lleva cada fila. Con tres copias, añadir una columna obligaria a
   acordarse de las tres.

   No hace falta filtrar por empresa: el backend devuelve lo que a cada quien le
   toca, porque el alcance va en la consulta. Aqui no se decide quien ve que.

   Para el personal interno la lista es otra cosa. No es un tablero de trabajo
   —no puede mover un pedido, el backend se lo prohibe con un 403 explicito—
   sino la cuenta de lo que se movio: quien le compro a quien y cuanto deja cada
   pedido. Por eso ahi se nombran las dos empresas y aparece la comision, que el
   backend le manda y a los otros dos no. */

export type OrderSide = 'buyer' | 'supplier' | 'staff';

const COPY: Record<
  OrderSide,
  { titulo: string; descripcion: string; vacio: string; basePath: string }
> = {
  buyer: {
    titulo: 'Mis pedidos',
    descripcion: 'Lo que has pedido y en qué va cada entrega.',
    vacio: 'Todavía no has hecho ningún pedido.',
    basePath: '/buyer/account/orders',
  },
  supplier: {
    titulo: 'Pedidos recibidos',
    descripcion: 'Lo que te han pedido y lo que falta por despachar.',
    vacio: 'Todavía no te han hecho ningún pedido.',
    basePath: '/supplier/orders',
  },
  staff: {
    titulo: 'Pedidos',
    descripcion:
      'Todo lo que se ha movido en Suminia y lo que deja cada pedido en comisión.',
    vacio: 'Todavía no se ha hecho ningún pedido en Suminia.',
    basePath: '/admin/orders',
  },
};

const ESTADOS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PLACED', label: 'Esperando confirmación' },
  { value: 'CONFIRMED', label: 'Confirmados' },
  { value: 'SHIPPED', label: 'En camino' },
  { value: 'DELIVERED', label: 'Entregados' },
  { value: 'CANCELLED', label: 'Anulados' },
  { value: 'REJECTED', label: 'Rechazados' },
];

const PAGE_SIZE = 10;

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

export const OrdersListScreen = ({ side }: { side: OrderSide }) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const copy = COPY[side];
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useGetOrdersQuery(
    {
      page,
      limit: PAGE_SIZE,
      sort: 'createdAt',
      sortDirection: 'desc',
      ...(status ? { filter: { status } } : {}),
    },
    { skip: !hydrated },
  );

  if (!hydrated || isLoading) return <p className='font-light'>Cargando...</p>;

  if (isError) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(
          error,
          side === 'staff'
            ? 'No se pudieron cargar los pedidos.'
            : 'No se pudieron cargar tus pedidos.',
        )}
      </div>
    );
  }

  const orders = data?.data.data ?? [];
  const meta = data?.data.meta;

  return (
    <>
      <PageHeader title={copy.titulo} description={copy.descripcion} />

      <div className='orders-filter'>
        {ESTADOS.map((estado) => (
          <button
            type='button'
            key={estado.value}
            className={status === estado.value ? 'is-chosen' : undefined}
            onClick={() => {
              setStatus(estado.value);
              setPage(1);
            }}
          >
            {estado.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className='orders-empty'>
          <Package size={28} />
          <p className='font-light'>
            {status
              ? side === 'staff'
                ? 'No hay pedidos en ese estado.'
                : 'No tienes pedidos en ese estado.'
              : copy.vacio}
          </p>
          {/* Al comprador se le ofrece el catalogo; al proveedor no, que el
              pedido no depende de el. */}
          {side === 'buyer' && (
            <Link href='/catalog' className='btn btn-primary'>
              Ir al catálogo
            </Link>
          )}
        </div>
      ) : (
        <ul className='orders-list'>
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`${copy.basePath}/${order.id}`}>
                <div className='orders-line-main'>
                  <span className='orders-number'>#{order.number}</span>
                  {/* La otra empresa: quien vende si miro como comprador, y
                      quien compra si miro como proveedor. Para el personal
                      interno no hay "la otra": van las dos, porque lo que se
                      mira es la operacion entera. */}
                  <span className='orders-supplier'>
                    {side === 'staff' ? (
                      <>
                        {order.buyerOrganizationName}
                        <ArrowRight size={13} className='orders-arrow' />
                        {order.supplierOrganizationName}
                      </>
                    ) : side === 'buyer' ? (
                      order.supplierOrganizationName
                    ) : (
                      order.buyerOrganizationName
                    )}
                  </span>
                  <small className='font-light'>
                    {formatDate(order.createdAt)} ·{' '}
                    {order.items.length}{' '}
                    {order.items.length === 1 ? 'producto' : 'productos'}
                  </small>
                </div>

                <span className={`badge ${ORDER_STATUS_CLASS[order.status]}`}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>

                <span className='orders-total'>
                  <strong>{pesos(order.total, order.currency)}</strong>
                  {/* Lo que deja el pedido. Solo al personal interno: el
                      backend no manda la cifra a los otros dos.

                      Y solo si el pedido llego a cobrarse: en uno anulado o
                      rechazado la comision sigue calculada en la base, pero
                      enseñarla ahi seria contar un ingreso que no existe. */}
                  {side === 'staff' &&
                    order.commissionAmount !== null &&
                    order.status !== 'CANCELLED' &&
                    order.status !== 'REJECTED' && (
                      <small className='font-light'>
                        comisión {pesos(order.commissionAmount, order.currency)}
                      </small>
                    )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onChange={setPage} label='pedidos' />
      )}
    </>
  );
};

export default OrdersListScreen;

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Package } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetOrdersQuery } from '../../api/ordersApi';
import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
} from '../../lib/orderStatus';
import type { OrderStatus } from '../../model/order.types';

/* Los pedidos de la empresa: los que hizo si es compradora, los que le hicieron
   si es proveedora.

   Es la misma pantalla para los dos lados porque la lista es la misma —numero,
   la otra empresa, fecha, estado y total— y lo unico que cambia es a quien se
   nombra y a donde lleva cada fila. Con dos copias, añadir una columna
   obligaria a acordarse de las dos.

   No hace falta filtrar por empresa: el backend solo devuelve los suyos, porque
   el alcance va en la consulta. Aqui no se decide quien ve que. */

export type OrderSide = 'buyer' | 'supplier';

const COPY: Record<
  OrderSide,
  { titulo: string; vacio: string; basePath: string }
> = {
  buyer: {
    titulo: 'Mis pedidos',
    vacio: 'Todavía no has hecho ningún pedido.',
    basePath: '/buyer/account/orders',
  },
  supplier: {
    titulo: 'Pedidos recibidos',
    vacio: 'Todavía no te han hecho ningún pedido.',
    basePath: '/supplier/orders',
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
        {extractErrorMessage(error, 'No se pudieron cargar tus pedidos.')}
      </div>
    );
  }

  const orders = data?.data.data ?? [];
  const meta = data?.data.meta;

  return (
    <>
      <div className='box-head'>
        <h3>{copy.titulo}</h3>
      </div>

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
            {status ? 'No tienes pedidos en ese estado.' : copy.vacio}
          </p>
          {/* Al comprador se le ofrece el catalogo; al proveedor no, que el
              pedido no depende de el. */}
          {side === 'buyer' && (
            <Link href='/catalog' className='btn btn-primary rounded-1'>
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
                      quien compra si miro como proveedor. */}
                  <span className='orders-supplier'>
                    {side === 'buyer'
                      ? order.supplierOrganizationName
                      : order.buyerOrganizationName}
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

                <strong className='orders-total'>
                  {pesos(order.total, order.currency)}
                </strong>
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

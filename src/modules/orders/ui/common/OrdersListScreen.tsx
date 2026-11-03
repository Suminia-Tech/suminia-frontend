'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';
import { ArrowRight, Package } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { PageHeader, PageSkeleton, Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetOrderMetricsQuery, useGetOrdersQuery } from '../../api/ordersApi';
import {
  displayStatus,
  paymentSummary,
  TONE_PILL,
} from '../../lib/orderStatus';
import {
  EMPTY_STAFF_FILTERS,
  monthLabel,
  monthOf,
  toFilterParams,
  type StaffOrderFilters,
} from '../../lib/staffFilters';
import type { OrderStatus } from '../../model/order.types';
import StaffOrderFiltersPanel from '../staff/StaffOrderFiltersPanel';

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
    basePath: '/buyer/orders',
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
      'Todo lo que se ha movido en Suminia y el margen que deja cada pedido.',
    vacio: 'Todavía no se ha hecho ningún pedido en Suminia.',
    basePath: '/admin/orders',
  },
};

const ESTADOS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PLACED', label: 'Esperando confirmación' },
  { value: 'AWAITING_BUYER', label: 'Disponibilidad parcial' },
  { value: 'CONFIRMED', label: 'Confirmados' },
  { value: 'SHIPPED', label: 'En camino' },
  { value: 'DELIVERED', label: 'Entregados' },
  { value: 'CANCELLED', label: 'Cancelados' },
  { value: 'REJECTED', label: 'Rechazados' },
];

const PAGE_SIZE = 10;

/* Las bandejas del dinero del superadmin: la misma lista con un filtro fijo y
   su propio titulo. Ahi no hay chips de estado ni filtros de analisis: la
   bandeja ya dice que se mira. */
export type OrdersQueue = 'payments' | 'toInvoice' | 'claims' | 'refunds' | 'invoices' | 'overdue';

const QUEUES: Record<
  OrdersQueue,
  { titulo: string; descripcion: string; vacio: string; filter: Record<string, string> }
> = {
  payments: {
    titulo: 'Pagos por verificar',
    descripcion:
      'Comprobantes que subieron los compradores. Verifícalos contra el banco: el proveedor despacha cuando lo apruebes.',
    vacio: 'No hay comprobantes por verificar.',
    filter: { paymentStatus: 'SUBMITTED' },
  },
  claims: {
    titulo: 'Reclamos',
    descripcion:
      'Reclamos abiertos de compradores. Mientras no se resuelvan, el pedido no se cierra ni se le liquida al proveedor.',
    vacio: 'No hay reclamos abiertos.',
    filter: { claim: 'open' },
  },
  refunds: {
    titulo: 'Devoluciones',
    descripcion:
      'Pedidos que se cancelaron después de pagados. Devuélvele la plata al comprador y registra el comprobante.',
    vacio: 'No hay devoluciones pendientes.',
    filter: { refund: 'true' },
  },
  invoices: {
    titulo: 'Facturas de proveedores',
    descripcion: 'Pedidos despachados a los que el proveedor todavía no le adjunta su factura a Suminia.',
    vacio: 'Todos los pedidos despachados tienen la factura del proveedor.',
    filter: { invoiced: 'false' },
  },
  toInvoice: {
    titulo: 'Por facturar',
    descripcion:
      'Pedidos con el pago verificado (o a crédito) a los que Suminia todavía no les emite la factura al comprador.',
    vacio: 'No hay pedidos por facturar.',
    filter: { toInvoice: 'true' },
  },
  overdue: {
    titulo: 'Pagos vencidos',
    descripcion: 'Pedidos a crédito cuyo plazo para pagar ya pasó.',
    vacio: 'No hay pagos vencidos.',
    filter: { overdue: 'true' },
  },
};

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

export const OrdersListScreen = ({
  side,
  queue,
}: {
  side: OrderSide;
  queue?: OrdersQueue;
}) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const copy = queue ? { ...COPY[side], ...QUEUES[queue] } : COPY[side];
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [page, setPage] = useState(1);
  /* Los filtros de analisis son solo del personal de Suminia: el proveedor y
     el comprador ven sus propios pedidos, y con el estado les basta. */
  const [staffFilters, setStaffFilters] = useState<StaffOrderFilters>(EMPTY_STAFF_FILTERS);
  const isStaff = side === 'staff';
  const filter = queue
    ? QUEUES[queue].filter
    : {
        ...(status ? { status } : {}),
        ...(isStaff ? toFilterParams(staffFilters) : {}),
      };

  const { data, isLoading, isError, error } = useGetOrdersQuery(
    {
      page,
      limit: PAGE_SIZE,
      sort: 'createdAt',
      sortDirection: 'desc',
      ...(Object.keys(filter).length > 0 ? { filter } : {}),
    },
    { skip: !hydrated },
  );
  const { data: metrics } = useGetOrderMetricsQuery(filter, {
    skip: !hydrated || !isStaff || Boolean(queue),
  });

  if (!hydrated || isLoading) return <PageSkeleton variant='list' />;

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

      {!queue && (
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
      )}

      {isStaff && !queue && (
        <StaffOrderFiltersPanel
          filters={staffFilters}
          metrics={metrics?.data}
          onChange={(next) => {
            setStaffFilters(next);
            setPage(1);
          }}
        />
      )}

      {orders.length === 0 ? (
        <div className='orders-empty'>
          <Package size={28} />
          <p className='font-light'>
            {!queue && (status || Object.keys(filter).length > 0)
              ? side === 'staff'
                ? 'No hay pedidos con esos filtros.'
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
          {orders.map((order, index) => (
            <Fragment key={order.id}>
              {/* Clasificados por mes y año: un encabezado cada vez que cambia
                  el mes, en hora de Colombia como lo cuenta el backend. Solo
                  para el personal de Suminia, que es quien compara meses. */}
              {isStaff &&
                (index === 0 ||
                  monthOf(orders[index - 1].createdAt) !== monthOf(order.createdAt)) && (
                  <li className='orders-month'>{monthLabel(monthOf(order.createdAt))}</li>
                )}
              <li>
                <Link href={`${copy.basePath}/${order.id}`}>
                  <div className='orders-line-main'>
                    <span className='orders-number'>{order.code}</span>
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
                    {(() => {
                      const pago = paymentSummary(order, side);
                      return (
                        pago && (
                          <span className={`status-pill ${TONE_PILL[pago.tone]}`}>
                            {pago.label}
                          </span>
                        )
                      );
                    })()}
                  </div>

                  <span className={`badge ${displayStatus(order).className}`}>
                    {displayStatus(order).label}
                  </span>

                  <span className='orders-total'>
                    <strong>{pesos(order.total, order.currency)}</strong>
                    {/* Lo que deja el pedido. Solo al personal interno: el
                        backend no manda la cifra a los otros dos.

                        Y solo si el pedido llego a cobrarse: en uno cancelado o
                        rechazado la comision sigue calculada en la base, pero
                        enseñarla ahi seria contar un ingreso que no existe. */}
                    {side === 'staff' &&
                      order.commissionAmount !== null &&
                      order.status !== 'CANCELLED' &&
                      order.status !== 'REJECTED' && (
                        <small className='font-light'>
                          margen {pesos(order.commissionAmount, order.currency)}
                        </small>
                      )}
                  </span>
                </Link>
              </li>
            </Fragment>
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

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, ChevronLeft, MapPin } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { useAppSelector } from '@/store/hooks';

import {
  useChangeOrderStatusMutation,
  useGetOrderQuery,
} from '../../api/ordersApi';
import {
  buyerCanCancel,
  buyerCanConfirmDelivery,
  ORDER_STATUS_CLASS,
  ORDER_STATUS_HINT,
  ORDER_STATUS_LABEL,
  ORDER_TIMELINE,
} from '../../lib/orderStatus';
import type { Order } from '../../model/order.types';

/* La ficha de un pedido, del lado de quien lo hizo.

   Lleva lo que el comprador necesita para hablar de el con su proveedor: el
   consecutivo, que es como se refieren a el por telefono, lo que pidio con el
   precio que pago, a donde va y en que punto esta.

   No lleva la comision. El backend no se la manda —llega en null— y no es un
   descuido: lo que se queda Suminia es cosa entre Suminia y el proveedor. */

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

/* El recorrido, con lo andado marcado. Un pedido muerto no lo dibuja: no se
   quedo a medio camino, se salio. */
const Timeline = ({ order }: { order: Order }) => {
  if (!ORDER_TIMELINE.includes(order.status)) return null;

  const actual = ORDER_TIMELINE.indexOf(order.status);
  const fechas: Record<string, string | null> = {
    PLACED: order.createdAt,
    CONFIRMED: order.confirmedAt,
    SHIPPED: order.shippedAt,
    DELIVERED: order.deliveredAt,
  };

  return (
    <ol className='order-timeline'>
      {ORDER_TIMELINE.map((paso, indice) => (
        <li key={paso} className={indice <= actual ? 'is-done' : undefined}>
          <span className='order-timeline-dot'>
            {indice <= actual && <Check size={12} />}
          </span>
          <span>
            {ORDER_STATUS_LABEL[paso]}
            {fechas[paso] && (
              <small className='font-light'>{formatDate(fechas[paso])}</small>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
};

export const OrderDetailScreen = ({ orderId }: { orderId: string }) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { data, isLoading, isError, error } = useGetOrderQuery(orderId, {
    skip: !hydrated,
  });
  const [changeStatus, { isLoading: isSaving }] = useChangeOrderStatusMutation();
  const [motivo, setMotivo] = useState('');
  const [anulando, setAnulando] = useState(false);

  if (!hydrated || isLoading) return <p className='font-light'>Cargando...</p>;

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el pedido.')}
      </div>
    );
  }

  const order = data.data;

  const mover = async (
    status: Order['status'],
    exito: string,
    reason?: string,
  ) => {
    try {
      await changeStatus({ id: order.id, status, reason }).unwrap();
      toast.success(exito);
      setAnulando(false);
      setMotivo('');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo actualizar el pedido.'));
    }
  };

  return (
    <>
      <Link
        href='/buyer/account/orders'
        className='font-light d-inline-flex align-items-center gap-1 mb-3'
      >
        <ChevronLeft size={16} />
        Mis pedidos
      </Link>

      <div className='order-head'>
        <div>
          <h2>Pedido #{order.number}</h2>
          <p className='font-light mb-0'>
            {order.supplierOrganizationName} · {formatDate(order.createdAt)}
          </p>
        </div>
        <span className={`badge ${ORDER_STATUS_CLASS[order.status]}`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      <p className='order-hint font-light'>{ORDER_STATUS_HINT[order.status]}</p>

      {order.statusReason && (
        <div className='alert alert-warning'>
          <strong>Motivo:</strong> {order.statusReason}
        </div>
      )}

      <Timeline order={order} />

      <div className='box-head mt-4'>
        <h3>Qué pediste</h3>
      </div>

      <ul className='order-items'>
        {order.items.map((item) => (
          <li key={item.id}>
            <span className='order-item-name'>
              {item.productName}
              <small className='font-light'>
                {item.presentationName} · {item.packaging}
                {item.cum && ` · CUM ${item.cum}`}
              </small>
            </span>
            <span className='order-item-qty'>
              {item.quantity} × {pesos(item.unitPrice, order.currency)}
            </span>
            <strong>{pesos(item.subtotal, order.currency)}</strong>
          </li>
        ))}
      </ul>

      <ul className='cart-summary-lines order-totals'>
        <li>
          <span className='font-light'>Subtotal</span>
          <span>{pesos(order.subtotal, order.currency)}</span>
        </li>
        <li>
          <span className='font-light'>IVA</span>
          <span>{pesos(order.tax, order.currency)}</span>
        </li>
        <li className='cart-summary-total'>
          <span>Total</span>
          <strong>{pesos(order.total, order.currency)}</strong>
        </li>
      </ul>

      <div className='box-head mt-4'>
        <h3>A dónde va</h3>
      </div>

      <div className='order-delivery'>
        <p className='location-address'>
          <MapPin size={14} />
          <span>
            <strong>{order.delivery.name}</strong>
            <br />
            {order.delivery.address} · {order.delivery.city}
            {order.delivery.department && `, ${order.delivery.department}`}
          </span>
        </p>
        <ul className='location-details'>
          {order.delivery.contact && <li>{order.delivery.contact}</li>}
          {order.delivery.phone && <li>{order.delivery.phone}</li>}
          {order.delivery.hours && <li>{order.delivery.hours}</li>}
        </ul>
        {order.delivery.notes && (
          <p className='location-notes font-light'>{order.delivery.notes}</p>
        )}
      </div>

      {order.buyerNotes && (
        <>
          <div className='box-head mt-4'>
            <h3>Tu nota al proveedor</h3>
          </div>
          <p className='font-light'>{order.buyerNotes}</p>
        </>
      )}

      {(buyerCanConfirmDelivery(order.status) || buyerCanCancel(order.status)) && (
        <div className='order-actions'>
          {buyerCanConfirmDelivery(order.status) && (
            <button
              type='button'
              className='btn btn-primary btn-sm'
              disabled={isSaving}
              onClick={() => mover('DELIVERED', 'Gracias por confirmar')}
            >
              Ya lo recibí
            </button>
          )}

          {buyerCanCancel(order.status) &&
            (anulando ? (
              <div className='order-cancel'>
                <label className='form-label'>¿Por qué lo anulas?</label>
                <input
                  type='text'
                  className='form-control'
                  maxLength={500}
                  value={motivo}
                  onChange={(event) => setMotivo(event.target.value)}
                  placeholder='Pedido duplicado, ya no lo necesitamos...'
                />
                <small className='font-light'>
                  El proveedor lo va a leer.
                </small>
                <div className='d-flex gap-2 mt-2'>
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm'
                    disabled={isSaving || !motivo.trim()}
                    onClick={() => mover('CANCELLED', 'Pedido anulado', motivo)}
                  >
                    Anular pedido
                  </button>
                  <button
                    type='button'
                    className='btn btn-outline-secondary btn-sm'
                    disabled={isSaving}
                    onClick={() => setAnulando(false)}
                  >
                    Mejor no
                  </button>
                </div>
              </div>
            ) : (
              <button
                type='button'
                className='btn btn-outline-danger btn-sm'
                onClick={() => setAnulando(true)}
              >
                Anular pedido
              </button>
            ))}
        </div>
      )}

      {/* Se dice por que ya no se puede anular, en vez de no enseñar nada: sin
          explicacion el boton parece que se perdio. */}
      {!buyerCanCancel(order.status) && order.status === 'CONFIRMED' && (
        <p className='font-light order-locked'>
          El proveedor ya confirmó este pedido. Para anularlo ahora, escríbele.
        </p>
      )}
    </>
  );
};

export default OrderDetailScreen;

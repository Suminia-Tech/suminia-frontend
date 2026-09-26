'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, ChevronLeft, MapPin } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { Panel } from '@/shared/ui';
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
  supplierCanCancel,
  supplierCanConfirmDelivery,
  supplierCanDecide,
  supplierCanShip,
} from '../../lib/orderStatus';
import type { Order, OrderStatus } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* La ficha de un pedido, para los dos lados.

   Lo que se lee es lo mismo —el consecutivo, que es como se refieren a el por
   telefono; lo que se pidio al precio que se pago; a donde va; en que punto
   esta— y lo que cambia es a quien se nombra y que se puede hacer.

   Lo que si es de uno solo: la comision. El backend no se la manda al
   comprador —llega en null— y no es un descuido: lo que se queda Suminia es
   cosa entre Suminia y el proveedor. */

const COPY: Record<
  OrderSide,
  { volver: string; basePath: string; nota: string }
> = {
  buyer: {
    volver: 'Mis pedidos',
    basePath: '/buyer/account/orders',
    nota: 'Tu nota al proveedor',
  },
  supplier: {
    volver: 'Pedidos recibidos',
    basePath: '/supplier/orders',
    nota: 'Nota del comprador',
  },
};

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

interface OrderDetailScreenProps {
  orderId: string;
  side: OrderSide;
}

export const OrderDetailScreen = ({
  orderId,
  side,
}: OrderDetailScreenProps) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { data, isLoading, isError, error } = useGetOrderQuery(orderId, {
    skip: !hydrated,
  });
  const [changeStatus, { isLoading: isSaving }] = useChangeOrderStatusMutation();
  const [motivo, setMotivo] = useState('');
  /* Que accion esta pidiendo motivo, o null. Anular y rechazar lo exigen; las
     demas van directas. */
  const [pidiendoMotivo, setPidiendoMotivo] = useState<OrderStatus | null>(null);
  const copy = COPY[side];

  if (!hydrated || isLoading) return <p className='font-light'>Cargando...</p>;

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el pedido.')}
      </div>
    );
  }

  const order = data.data;

  /* Si no hay ninguna accion posible, el panel no aparece: un "¿Qué sigue?"
     vacio es peor que no decir nada. */
  const hayAcciones =
    side === 'supplier'
      ? supplierCanDecide(order.status) ||
        supplierCanShip(order.status) ||
        supplierCanConfirmDelivery(order.status) ||
        supplierCanCancel(order.status)
      : buyerCanConfirmDelivery(order.status) || buyerCanCancel(order.status);

  const mover = async (
    status: Order['status'],
    exito: string,
    reason?: string,
  ) => {
    try {
      await changeStatus({ id: order.id, status, reason }).unwrap();
      toast.success(exito);
      setPidiendoMotivo(null);
      setMotivo('');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo actualizar el pedido.'));
    }
  };

  return (
    <>
      <Link
        href={copy.basePath}
        className='font-light d-inline-flex align-items-center gap-1 mb-3'
      >
        <ChevronLeft size={16} />
        {copy.volver}
      </Link>

      <div className='order-head'>
        <div>
          <h1>Pedido #{order.number}</h1>
          <p className='font-light mb-0'>
            {side === 'buyer'
              ? order.supplierOrganizationName
              : order.buyerOrganizationName}{' '}
            · {formatDate(order.createdAt)}
            {side === 'supplier' && ` · pidió ${order.placedByName}`}
          </p>
        </div>
        <span className={`badge ${ORDER_STATUS_CLASS[order.status]}`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      {/* El recorrido y lo que significa el punto en el que esta, juntos y en
          su propia caja. Antes la frase iba suelta bajo el titulo y la linea de
          estados debajo, sin nada que las relacionara. */}
      <Panel className='order-state'>
        <p className='order-hint'>{ORDER_STATUS_HINT[order.status]}</p>

        {order.statusReason && (
          <div className='alert alert-warning'>
            <strong>Motivo:</strong> {order.statusReason}
          </div>
        )}

        <Timeline order={order} />
      </Panel>

      {/* Dos columnas: a la izquierda lo que se pidio, que es lo que mas ocupa;
          a la derecha lo que hay que hacer y los datos de apoyo. En una sola
          columna, el pedido dejaba media pantalla vacia a la derecha y los
          botones acababan al final de todo, despues de la direccion y la nota. */}
      <div className='order-layout'>
        <div className='order-main'>
      <Panel title={side === 'buyer' ? 'Qué pediste' : 'Qué te pidieron'}>
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
      </Panel>
        </div>

        <aside className='order-side'>
      {/* Lo que se puede hacer va en panel propio y arriba del todo en la
          columna: para un proveedor que abre un pedido nuevo, confirmarlo es a
          lo que viene. Estaba al final de la pagina, despues de la direccion,
          la nota y la liquidacion.

          Sin titulo: los botones dicen lo que hacen —"Confirmar pedido", "No
          puedo atenderlo"— y encabezarlos con un "¿Qué sigue?" no añadia nada
          y se leia como una pregunta sin responder. Lo que sigue ya lo dice la
          frase de estado, arriba, junto al recorrido. */}
      {hayAcciones && (
      <Panel className='order-next'>
      <div className='order-actions'>
        {side === 'supplier' && supplierCanDecide(order.status) && (
          <>
            <button
              type='button'
              className='btn btn-primary btn-sm'
              disabled={isSaving}
              onClick={() =>
                mover('CONFIRMED', 'Pedido confirmado. Ya puedes despacharlo')
              }
            >
              Confirmar pedido
            </button>
            <button
              type='button'
              className='btn btn-outline-danger btn-sm'
              disabled={isSaving}
              onClick={() => setPidiendoMotivo('REJECTED')}
            >
              No puedo atenderlo
            </button>
          </>
        )}

        {side === 'supplier' && supplierCanShip(order.status) && (
          <button
            type='button'
            className='btn btn-primary btn-sm'
            disabled={isSaving}
            onClick={() => mover('SHIPPED', 'Pedido despachado')}
          >
            Ya lo despaché
          </button>
        )}

        {side === 'supplier' && supplierCanConfirmDelivery(order.status) && (
          <button
            type='button'
            className='btn btn-primary btn-sm'
            disabled={isSaving}
            onClick={() => mover('DELIVERED', 'Pedido entregado')}
          >
            Confirmar entrega
          </button>
        )}

        {side === 'supplier' && supplierCanCancel(order.status) && (
          <button
            type='button'
            className='btn btn-outline-danger btn-sm'
            disabled={isSaving}
            onClick={() => setPidiendoMotivo('CANCELLED')}
          >
            Anular pedido
          </button>
        )}

        {side === 'buyer' && buyerCanConfirmDelivery(order.status) && (
          <button
            type='button'
            className='btn btn-primary btn-sm'
            disabled={isSaving}
            onClick={() => mover('DELIVERED', 'Gracias por confirmar')}
          >
            Ya lo recibí
          </button>
        )}

        {side === 'buyer' && buyerCanCancel(order.status) && (
          <button
            type='button'
            className='btn btn-outline-danger btn-sm'
            disabled={isSaving}
            onClick={() => setPidiendoMotivo('CANCELLED')}
          >
            Anular pedido
          </button>
        )}

        {/* El motivo no es un tramite: es lo unico que el otro lado va a leer
            para entender que paso con su pedido. */}
        {pidiendoMotivo && (
          <div className='order-cancel'>
            <label className='form-label'>
              {pidiendoMotivo === 'REJECTED'
                ? '¿Por qué no puedes atenderlo?'
                : '¿Por qué lo anulas?'}
            </label>
            <input
              type='text'
              className='form-control'
              maxLength={500}
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              placeholder={
                pidiendoMotivo === 'REJECTED'
                  ? 'Sin existencias hasta el 20, fuera de nuestra zona...'
                  : 'Pedido duplicado, ya no lo necesitamos...'
              }
            />
            <small className='font-light'>
              {side === 'buyer'
                ? 'El proveedor lo va a leer.'
                : 'El comprador lo va a leer.'}
            </small>
            <div className='d-flex gap-2 mt-2'>
              <button
                type='button'
                className='btn btn-outline-danger btn-sm'
                disabled={isSaving || !motivo.trim()}
                onClick={() =>
                  mover(
                    pidiendoMotivo,
                    pidiendoMotivo === 'REJECTED'
                      ? 'Pedido rechazado'
                      : 'Pedido anulado',
                    motivo,
                  )
                }
              >
                {pidiendoMotivo === 'REJECTED'
                  ? 'Rechazar pedido'
                  : 'Anular pedido'}
              </button>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                disabled={isSaving}
                onClick={() => {
                  setPidiendoMotivo(null);
                  setMotivo('');
                }}
              >
                Mejor no
              </button>
            </div>
          </div>
        )}
      </div>
      </Panel>
      )}

      <Panel title='A dónde va'>
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

      </Panel>

      {order.buyerNotes && (
        <Panel title={copy.nota}>
          <p className='font-light mb-0'>{order.buyerNotes}</p>
        </Panel>
      )}

      {/* Solo al proveedor: lo que le va a quedar despues de la comision. Es lo
          que va a cuadrar contra la consignacion. */}
      {side === 'supplier' && order.commissionAmount !== null && (
        <Panel title='Lo que recibes'>
          <ul className='cart-summary-lines order-totals'>
            <li>
              <span className='font-light'>Total del pedido</span>
              <span>{pesos(order.total, order.currency)}</span>
            </li>
            <li>
              <span className='font-light'>
                Comisión de Suminia ({order.commissionRate}%)
              </span>
              <span>−{pesos(order.commissionAmount, order.currency)}</span>
            </li>
            <li className='cart-summary-total'>
              <span>Te queda</span>
              <strong>
                {pesos(order.supplierPayout ?? 0, order.currency)}
              </strong>
            </li>
          </ul>
          <p className='font-light order-payout-note'>
            Se consigna a tu cuenta registrada cuando el pedido quede entregado.
          </p>
        </Panel>
      )}

      {/* Lo que cada lado puede hacer con el pedido donde esta. Las mismas
          reglas que valida el backend: aqui no se decide nada, se evita
          ofrecer un boton que iba a responder 422. */}

      {/* Se dice por que ya no se puede anular, en vez de no enseñar nada: sin
          explicacion el boton parece que se perdio. */}
      {side === 'buyer' && order.status === 'CONFIRMED' && (
        <Panel className='order-next'>
          <p className='font-light order-locked mb-0'>
            El proveedor ya confirmó este pedido. Para anularlo ahora, escríbele.
          </p>
        </Panel>
      )}
        </aside>
      </div>
    </>
  );
};

export default OrderDetailScreen;

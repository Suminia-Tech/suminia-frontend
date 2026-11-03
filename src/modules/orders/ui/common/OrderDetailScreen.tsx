'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, ChevronLeft, MapPin, RotateCcw } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { Panel } from '@/shared/ui';
import { formatDate, formatDay } from '@/shared/lib/dates';
import { useAppSelector } from '@/store/hooks';

import {
  useChangeOrderStatusMutation,
  useGetOrderQuery,
  useReorderMutation,
} from '../../api/ordersApi';
import {
  buyerCanAnswerAvailability,
  buyerCanCancel,
  buyerCanConfirmDelivery,
  CLOSED_HINT,
  displayStatus,
  ORDER_STATUS_HINT,
  ORDER_STATUS_HINT_SUPPLIER,
  ORDER_STATUS_LABEL,
  ORDER_TIMELINE,
  TIMELINE_POSITION,
  supplierCanCancel,
  supplierCanConfirmDelivery,
  supplierCanDecide,
    supplierCanShip,
  supplierWaitsPayment,
} from '../../lib/orderStatus';
import type { Order, OrderStatus } from '../../model/order.types';
import BuyerAvailabilityResponse from './BuyerAvailabilityResponse';
import OrderHistoryPanel from './OrderHistoryPanel';
import OrderInvoicePanel from './OrderInvoicePanel';
import OrderPaymentPanel from './OrderPaymentPanel';
import type { OrderSide } from './OrdersListScreen';
import SupplierAvailabilityForm from './SupplierAvailabilityForm';

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
    basePath: '/buyer/orders',
    nota: 'Tu nota al proveedor',
  },
  supplier: {
    volver: 'Pedidos recibidos',
    basePath: '/supplier/orders',
    nota: 'Nota del comprador',
  },
  staff: {
    volver: 'Pedidos',
    basePath: '/admin/orders',
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
  const posicion = TIMELINE_POSITION[order.status] ?? order.status;
  if (!ORDER_TIMELINE.includes(posicion)) return null;

  const actual = ORDER_TIMELINE.indexOf(posicion);
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
      {/* El ultimo paso: cerrado. Para el comprador cuando pasan los dias de
          reclamo; para Suminia y el proveedor, cuando se liquida. */}
      <li className={order.closed ? 'is-done' : undefined}>
        <span className='order-timeline-dot'>{order.closed && <Check size={12} />}</span>
        <span>Cerrado</span>
      </li>
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
  const [reorder, { isLoading: isReordering }] = useReorderMutation();
  const router = useRouter();
  const [motivo, setMotivo] = useState('');
  /* Que accion esta pidiendo motivo, o null. Cancelar y rechazar lo exigen; las
     demas van directas. */
  const [pidiendoMotivo, setPidiendoMotivo] = useState<OrderStatus | null>(null);
  /* El proveedor esta llenando su disponibilidad parcial. */
  const [proponiendo, setProponiendo] = useState(false);
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

  /* Si no hay ninguna accion posible, el panel no aparece: un panel de botones
     vacio es peor que no decir nada.

     El personal de Suminia nunca tiene ninguna. No es que no se le ofrezcan:
     el backend se lo prohibe con un 403 y el mensaje lo dice —"el personal de
     Suminia no mueve pedidos: eso es del comprador y del proveedor"—. Aqui
     cobra y liquida, que es otra cosa. */
  /* Por transferencia, el proveedor no despacha hasta que Suminia verifica el
     pago: el boton no aparece, y el panel de pago dice por que. */
  const puedeDespachar = supplierCanShip(order.status) && !supplierWaitsPayment(order);

  /* El comprador siempre tiene una: volver a pedir lo mismo. */
  const hayAcciones =
    side === 'staff'
      ? false
      : side === 'supplier'
        ? supplierCanDecide(order.status) ||
          puedeDespachar ||
          supplierCanConfirmDelivery(order.status) ||
          supplierCanCancel(order.status)
        : true;

  const volverAPedir = async () => {
    try {
      const { added, skipped } = (await reorder(order.id).unwrap()).data;
      if (added === 0) {
        toast.error('Ninguno de estos productos sigue a la venta.');
        return;
      }
      toast.success(
        skipped > 0
          ? `Agregamos ${added} al carrito. ${skipped} ya no están a la venta.`
          : 'Agregamos los productos al carrito',
      );
      router.push('/cart');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo agregar al carrito.'));
    }
  };

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
          <h1>Pedido {order.code}</h1>
          {/* La otra empresa. Para el personal de Suminia no hay "la otra":
              van las dos, porque no esta de ninguno de los dos lados. */}
          <p className='font-light mb-0'>
            {side === 'staff'
              ? `${order.buyerOrganizationName} → ${order.supplierOrganizationName}`
              : side === 'buyer'
                ? order.supplierOrganizationName
                : order.buyerOrganizationName}{' '}
            · {formatDate(order.createdAt)}
            {side !== 'buyer' && ` · pidió ${order.placedByName}`}
          </p>
        </div>
        <span className={`badge ${displayStatus(order).className}`}>
          {displayStatus(order).label}
        </span>
      </div>

      {/* El recorrido y lo que significa el punto en el que esta, juntos y en
          su propia caja. Antes la frase iba suelta bajo el titulo y la linea de
          estados debajo, sin nada que las relacionara. */}
      <Panel className='order-state'>
        <p className='order-hint'>
          {order.closed
            ? CLOSED_HINT[side]
            : (side === 'supplier' && ORDER_STATUS_HINT_SUPPLIER[order.status]) ||
              ORDER_STATUS_HINT[order.status]}
        </p>

        {/* Mientras se espera al comprador, lo que hay en statusReason es la
            nota del proveedor y no un motivo: se lee en la propuesta. */}
        {order.statusReason && order.status !== 'AWAITING_BUYER' && (
          <div className='alert alert-warning'>
            <strong>Motivo:</strong> {order.statusReason}
          </div>
        )}

        {/* El despacho parcial deja dos pedidos enlazados. Cada uno dice
            donde esta el otro, para no perder el hilo. */}
        {order.backorderOf && (
          <div className='alert alert-info'>
            Es lo que quedó pendiente del pedido{' '}
            <Link href={`${copy.basePath}/${order.backorderOf.id}`}>
              {order.backorderOf.code}
            </Link>
            {order.restockDate && `. Fecha prevista: ${formatDay(order.restockDate)}`}.
            {side === 'supplier' &&
              !order.stockReserved &&
              ' Al confirmarlo se descuenta de tus existencias: cárgalas antes.'}
          </div>
        )}
        {order.quote && side !== 'supplier' && (
          <div className='alert alert-info'>
            Salió de la cotización{' '}
            {side === 'buyer' ? (
              <Link href={`/buyer/account/quotes/${order.quote.id}`}>{order.quote.code}</Link>
            ) : (
              order.quote.code
            )}
            , a sus precios.
          </div>
        )}
        {order.backorders.length > 0 && (
          <div className='alert alert-info'>
            Lo que faltó va en{' '}
            {order.backorders.map((pendiente, indice) => (
              <span key={pendiente.id}>
                {indice > 0 && ', '}
                el pedido{' '}
                <Link href={`${copy.basePath}/${pendiente.id}`}>{pendiente.code}</Link>
              </span>
            ))}
            .
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
      {/* Lo que hay que decidir va primero: el proveedor llenando su
          disponibilidad, o el comprador respondiendo a ella. */}
      {side === 'supplier' && proponiendo && supplierCanDecide(order.status) && (
        <SupplierAvailabilityForm order={order} onClose={() => setProponiendo(false)} />
      )}
      {side === 'buyer' && buyerCanAnswerAvailability(order.status) && (
        <BuyerAvailabilityResponse order={order} pesos={pesos} />
      )}

      {/* "Detalles del pedido" para los tres: antes cada lado tenia su frase
          —"Qué pediste", "Qué te pidieron"— y se leian como conversacion. */}
      <Panel title='Detalles del pedido'>
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
              {order.status === 'AWAITING_BUYER' && item.availableQuantity !== null && (
                <small className='font-light d-block'>
                  disponibles {item.availableQuantity}
                </small>
              )}
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

      <OrderHistoryPanel order={order} />
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
            {/* Antes de rechazar por falta de inventario, ofrecer lo que hay:
                el comprador puede preferir recibir una parte ya. */}
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm'
              disabled={isSaving || proponiendo}
              onClick={() => setProponiendo(true)}
            >
              Tengo solo una parte
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

        {side === 'supplier' && puedeDespachar && (
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
            Cancelar pedido
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
            Cancelar pedido
          </button>
        )}

        {side === 'buyer' && (
          <button
            type='button'
            className='btn btn-outline-secondary btn-sm btn-with-icon'
            disabled={isReordering}
            onClick={volverAPedir}
          >
            <RotateCcw size={14} /> Volver a pedir
          </button>
        )}

        {/* El motivo no es un tramite: es lo unico que el otro lado va a leer
            para entender que paso con su pedido. */}
        {pidiendoMotivo && (
          <div className='order-cancel'>
            <label className='form-label'>
              {pidiendoMotivo === 'REJECTED'
                ? '¿Por qué no puedes atenderlo?'
                : '¿Por qué lo cancelas?'}
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
                      : 'Pedido cancelado',
                    motivo,
                  )
                }
              >
                {pidiendoMotivo === 'REJECTED'
                  ? 'Rechazar pedido'
                  : 'Cancelar pedido'}
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

      <OrderPaymentPanel order={order} side={side} />
      {/* Cada lado ve su factura: el comprador la de Suminia, el proveedor la
          suya a Suminia. El personal de Suminia, las dos. */}
      {side !== 'supplier' && <OrderInvoicePanel order={order} side={side} variant='suminia' />}
      {side !== 'buyer' && <OrderInvoicePanel order={order} side={side} variant='supplier' />}

      <Panel title='Dirección de entrega'>
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
      {/* La liquidacion. El proveedor mira lo que le queda; el personal de
          Suminia, lo que se queda Suminia. Es el mismo desglose leido desde los
          dos lados, y el backend le manda las cifras a los dos —al comprador
          no: el paga el total y punto—. */}
      {side !== 'buyer' && order.commissionAmount !== null && (
        <Panel title={side === 'staff' ? 'Liquidación' : 'Lo que recibes'}>
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
              <span>{side === 'staff' ? 'Al proveedor' : 'Te queda'}</span>
              <strong>
                {pesos(order.supplierPayout ?? 0, order.currency)}
              </strong>
            </li>
          </ul>
          <p className='font-light order-payout-note'>
            {order.payout
              ? order.payout.status === 'PAID'
                ? `Pagado en la liquidación ${order.payout.code}.`
                : `En la liquidación ${order.payout.code}, por pagar.`
              : order.payableAt
                ? `Entra en la primera liquidación después del ${formatDate(order.payableAt)}, cuando pasan los días de reclamo.`
                : side === 'staff'
                  ? 'Se le liquida al proveedor después de la entrega y los días de reclamo.'
                  : 'Se consigna a tu cuenta registrada después de la entrega y los días de reclamo.'}
          </p>
        </Panel>
      )}

      {/* Lo que cada lado puede hacer con el pedido donde esta. Las mismas
          reglas que valida el backend: aqui no se decide nada, se evita
          ofrecer un boton que iba a responder 422. */}

      {/* Se dice por que ya no se puede cancelar, en vez de no enseñar nada: sin
          explicacion el boton parece que se perdio. */}
      {side === 'buyer' && order.status === 'CONFIRMED' && (
        <Panel className='order-next'>
          <p className='font-light order-locked mb-0'>
            El proveedor ya confirmó este pedido. Para cancelarlo ahora, escríbele.
          </p>
        </Panel>
      )}
        </aside>
      </div>
    </>
  );
};

export default OrderDetailScreen;

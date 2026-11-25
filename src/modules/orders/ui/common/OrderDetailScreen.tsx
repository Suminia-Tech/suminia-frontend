'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useState, type ComponentType } from 'react';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  Download,
  MapPin,
  Package,
  RotateCcw,
  Truck,
  User,
} from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatPlace } from '@/shared/lib/colombia';
import { PageSkeleton, Panel } from '@/shared/ui';
import { formatDate, formatDay, formatMoment } from '@/shared/lib/dates';
import { presentationLabel } from '@/shared/lib/presentation';
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
  BUYER_STAGE_HINT,
  BUYER_TIMELINE,
  buyerStage,
  closedHint,
  deliveredHint,
  displayStatus,
  formatDeliveryDate,
  type BuyerStage,
  ORDER_STATUS_HINT,
  ORDER_STATUS_HINT_SUPPLIER,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_LABEL_SUPPLIER,
  SUPPLIER_ISSUE_LABEL,
  ORDER_TIMELINE,
  TIMELINE_POSITION,
  supplierCanCancel,
  supplierCanConfirmDelivery,
  supplierCanDecide,
  supplierCanShip,
  supplierWaitsPayment,
} from '../../lib/orderStatus';
import { condicionDePago, pesos } from '../../lib/orderFormat';
import { usePurchaseOrderPdf } from '../../hooks/usePurchaseOrderPdf';
import type { Order, OrderStatus } from '../../model/order.types';
import BuyerAvailabilityResponse from './BuyerAvailabilityResponse';
import OrderClaimPanel from './OrderClaimPanel';
import OrderHistoryPanel from './OrderHistoryPanel';
import OrderInvoicePanel from './OrderInvoicePanel';
import OrderNotesPanel from './OrderNotesPanel';
import { OrderItemLotForm, OrderItemLotInfo } from './OrderItemLot';
import OrderDeliveryPanel, { DELIVERY_FORM_ID } from './OrderDeliveryPanel';
import OrderPaymentPanel from './OrderPaymentPanel';
import type { OrderSide } from './OrdersListScreen';
import SupplierIssueForm from './SupplierIssueForm';
import SupplierShipmentForm, { SHIPMENT_FORM_ID } from './SupplierShipmentForm';

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
    nota: 'Indicaciones para la entrega',
  },
  supplier: {
    volver: 'Órdenes de compra',
    basePath: '/supplier/orders',
    nota: 'Indicaciones del comprador',
  },
  staff: {
    volver: 'Pedidos',
    basePath: '/admin/orders',
    nota: 'Indicaciones del comprador',
  },
};

/* Que hay dentro del pago al proveedor, segun el pedido: uno exento de IVA
   y con envio sin costo no puede decir "con IVA y envío". */
const composicionDelPago = (iva: number, envio: number): string =>
  [
    iva > 0 ? 'Incluye IVA.' : 'Productos exentos de IVA.',
    envio > 0 ? 'Incluye el costo de envío.' : 'Envío sin costo.',
  ].join(' ');

/* Lo que significa el paso en que va el pedido, dicho al comprador. */
const buyerHint = (order: Order): string => {
  if (order.status === 'AWAITING_BUYER') {
    return 'Hay una novedad: el proveedor no tiene todo lo que pediste. Revisa su propuesta y apruébala para continuar.';
  }
  const etapa = buyerStage(order);
  if (etapa === 'shipped' && order.estimatedDeliveryAt) {
    return `${BUYER_STAGE_HINT.shipped} Fecha estimada de entrega: ${formatDeliveryDate(order.estimatedDeliveryAt)}.`;
  }
  return BUYER_STAGE_HINT[etapa];
};

/* "2026-11-19" en hora de Colombia: el primer dia que se puede elegir. */
const hoyEnColombia = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());

/* Una segunda entrega atrasada: su fecha prevista ya paso y todavia no sale.
   La fecha es un dia sin hora; se compara contra hoy en Colombia. */
const segundaAtrasada = (order: Order): boolean =>
  order.restockDate !== null &&
  ['PLACED', 'AWAITING_BUYER', 'CONFIRMED'].includes(order.status) &&
  order.restockDate.slice(0, 10) < hoyEnColombia();

/* Los pasos de la orden de compra contados al proveedor. Lo que ya paso con
   check —la orden recibida cuando Suminia la emitio, la confirmacion—, y lo
   que le toca resaltado sin check: "Por confirmar" mientras no la confirma,
   que al confirmarla pasa a "Confirmada" con su fecha. Recibida y por
   confirmar son dos cosas distintas, y una orden sin confirmar no lleva check
   de nada que tenga que ver con confirmar. */
const pasoDelProveedor = (paso: OrderStatus, hecho: boolean): string => {
  switch (paso) {
    case 'PLACED':
      return 'Orden recibida';
    case 'CONFIRMED':
      return hecho ? 'Confirmada' : 'Por confirmar';
    default:
      return ORDER_STATUS_LABEL_SUPPLIER[paso];
  }
};

/* El recorrido, con lo andado marcado. Un pedido muerto no lo dibuja: no se
   quedo a medio camino, se salio. */
const Timeline = ({ order, side }: { order: Order; side: OrderSide }) => {
  if (side === 'buyer') return <BuyerTimeline order={order} />;
  const posicion = TIMELINE_POSITION[order.status] ?? order.status;
  if (!ORDER_TIMELINE.includes(posicion)) return null;

  const actual = ORDER_TIMELINE.indexOf(posicion);
  /* Al proveedor el pedido le llega cuando Suminia verifica el pago —o de
     una vez, a credito—: ese es su primer paso. El pago es de la clinica, y
     de la clinica el proveedor no sabe nada, de modo que no se le dibuja. */
  const proveedor = side === 'supplier';
  const fechas: Record<string, string | null> = {
    PLACED: proveedor ? (order.paidAt ?? order.createdAt) : order.createdAt,
    CONFIRMED: order.confirmedAt,
    SHIPPED: order.shippedAt,
    DELIVERED: order.deliveredAt,
  };

  return (
    <ol className='order-timeline'>
      {ORDER_TIMELINE.map((paso, indice) => (
        <Fragment key={paso}>
          <li
            className={
              indice <= actual
                ? 'is-done'
                : proveedor && indice === actual + 1
                  ? 'is-current'
                  : undefined
            }
          >
            <span className='order-timeline-dot'>
              {indice <= actual && <Check size={12} />}
            </span>
            <span>
              {proveedor ? pasoDelProveedor(paso, indice <= actual) : ORDER_STATUS_LABEL[paso]}
              <StepMoment iso={fechas[paso]} />
            </span>
          </li>
          {/* Por transferencia, el pago verificado va entre el pedido y la
              confirmacion: es lo que hace que el proveedor lo reciba. */}
          {paso === 'PLACED' && order.paymentMethod === 'TRANSFER' && !proveedor && (
            <li className={order.paidAt ? 'is-done' : undefined}>
              <span className='order-timeline-dot'>{order.paidAt && <Check size={12} />}</span>
              <span>
                Pago verificado
                <StepMoment iso={order.paidAt} />
              </span>
            </li>
          )}
        </Fragment>
      ))}
      {/* Para Suminia y el proveedor, antes de cerrar va el pago al
          proveedor: es lo que lo cierra de su lado. El comprador ve sus
          cuatro pasos aparte, en BuyerTimeline. */}
      <TimelineStep
        done={order.payout?.status === 'PAID'}
        label={side === 'supplier' ? 'Pago recibido' : 'Pagado al proveedor'}
        date={order.payout?.paidAt ?? null}
      />
      <TimelineStep
        done={order.closed}
        label='Cerrado'
        date={order.payout?.paidAt ?? null}
      />
    </ol>
  );
};

/* Los cuatro pasos que ve el comprador. Recibido se marca con el pago
   confirmado; despachado lleva la fecha estimada de entrega mientras no
   llega. Un pedido cancelado o no disponible no lo dibuja. */
const BuyerTimeline = ({ order }: { order: Order }) => {
  const etapa = buyerStage(order);
  const orden: BuyerStage[] = ['received', 'preparing', 'shipped', 'delivered'];
  const actual = orden.indexOf(etapa);
  if (actual === -1 && etapa !== 'awaitingPayment') return null;

  const fechas: Partial<Record<BuyerStage, string | null>> = {
    received: order.paidAt ?? (order.paymentMethod === 'CREDIT' ? order.createdAt : null),
    preparing: order.confirmedAt,
    shipped: order.shippedAt,
    delivered: order.deliveredAt,
  };

  return (
    <ol className='order-timeline'>
      {BUYER_TIMELINE.map(({ stage, label }, indice) => {
        const hecho = indice <= actual;
        return (
          <li key={stage} className={hecho ? 'is-done' : undefined}>
            <span className='order-timeline-dot'>{hecho && <Check size={12} />}</span>
            <span>
              {label}
              {hecho && <StepMoment iso={fechas[stage]} />}
              {stage === 'delivered' && etapa === 'shipped' && order.estimatedDeliveryAt && (
                <small className='font-light'>
                  Estimada: {formatDeliveryDate(order.estimatedDeliveryAt)}
                </small>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

/* El dia y la hora de un paso, uno debajo del otro. La hora queda para la
   trazabilidad: cuanto tardo cada paso, y en que orden pasaron dos cosas del
   mismo dia. */
const StepMoment = ({ iso }: { iso: string | null | undefined }) => {
  const momento = formatMoment(iso);
  if (!momento) return null;
  return (
    <small className='font-light'>
      {momento.dia}
      <br />
      {momento.hora}
    </small>
  );
};

const TimelineStep = ({
  done,
  label,
  date,
}: {
  done: boolean;
  label: string;
  date: string | null;
}) => (
  <li className={done ? 'is-done' : undefined}>
    <span className='order-timeline-dot'>{done && <Check size={12} />}</span>
    <span>
      {label}
      {done && <StepMoment iso={date} />}
    </span>
  </li>
);

/* La liquidacion al proveedor vive en finanzas, y un modulo no importa otro:
   la pagina la pasa ya armada y la ficha solo le dice de que pedido se trata. */
export interface OrderPayoutPanelProps {
  orderId: string;
  supplierOrganizationId: string;
  payout: Order['payout'];
}

interface OrderDetailScreenProps {
  orderId: string;
  side: OrderSide;
  PayoutPanel?: ComponentType<OrderPayoutPanelProps>;
}

export const OrderDetailScreen = ({
  orderId,
  side,
  PayoutPanel,
}: OrderDetailScreenProps) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { data, isLoading, isError, error } = useGetOrderQuery(orderId, {
    skip: !hydrated,
  });
  const [changeStatus, { isLoading: isSaving }] = useChangeOrderStatusMutation();
  const [reorder, { isLoading: isReordering }] = useReorderMutation();
  const ordenDeCompra = usePurchaseOrderPdf();
  const router = useRouter();
  const [motivo, setMotivo] = useState('');
  /* Que accion esta pidiendo motivo, o null. Cancelar y rechazar lo exigen; las
     demas van directas. */
  const [pidiendoMotivo, setPidiendoMotivo] = useState<OrderStatus | null>(null);
  /* El proveedor esta reportando una novedad: antes de confirmar la orden la
     devuelve, despues la cancela. */
  const [reportando, setReportando] = useState(false);
  /* El producto cuyo lote se esta anotando: uno a la vez. */
  const [loteAbierto, setLoteAbierto] = useState<string | null>(null);
  const copy = COPY[side];

  if (!hydrated || isLoading) return <PageSkeleton variant='detail' />;

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el pedido.')}
      </div>
    );
  }

  const order = data.data;
  /* Por transferencia, hasta que se verifica el pago lo que se espera es el
     pago, no al proveedor: el todavia no ve el pedido. */
  const esperandoPago =
    order.status === 'PLACED' &&
    order.paymentMethod === 'TRANSFER' &&
    (order.paymentStatus === 'PENDING' || order.paymentStatus === 'SUBMITTED');

  /* Si no hay ninguna accion posible, el panel no aparece: un panel de botones
     vacio es peor que no decir nada.

     El personal de Suminia nunca tiene ninguna. No es que no se le ofrezcan:
     el backend se lo prohibe con un 403 y el mensaje lo dice —"el personal de
     Suminia no mueve pedidos: eso es del comprador y del proveedor"—. Aqui
     cobra y liquida, que es otra cosa. */
  /* Por transferencia, el proveedor no despacha hasta que Suminia verifica el
     pago: el boton no aparece, y el panel de pago dice por que. */
  const puedeDespachar = supplierCanShip(order.status) && !supplierWaitsPayment(order);
  const anotaLotes =
    side === 'supplier' && (order.status === 'CONFIRMED' || order.status === 'SHIPPED');

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
    estimatedDeliveryAt?: string,
  ) => {
    try {
      await changeStatus({ id: order.id, status, reason, estimatedDeliveryAt }).unwrap();
      toast.success(exito);
      setPidiendoMotivo(null);
      setMotivo('');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo actualizar el pedido.'));
    }
  };

  /* La orden de compra se descarga del lado de quien la tiene: el proveedor,
     a quien se le emite, y Suminia. Por transferencia se emite al verificar
     el pago; antes no existe. */
  const codigoOrdenDeCompra =
    side === 'supplier' ? order.code : side === 'staff' ? order.purchaseCode : null;
  const puedeDescargarOrden = codigoOrdenDeCompra !== null && !esperandoPago;

  const entrega = order.delivery;
  const novedad =
    order.supplierIssue &&
    ['REJECTED', 'CANCELLED', 'AWAITING_BUYER'].includes(order.status)
      ? SUPPLIER_ISSUE_LABEL[order.supplierIssue]
      : null;

  return (
    <>
      <Link
        href={copy.basePath}
        className='back-link'
      >
        <ChevronLeft size={16} />
        {copy.volver}
      </Link>

      <div className='order-head'>
        <div>
          {side === 'staff' ? (
            /* Sin titulo: los dos numeros van en las tarjetas de abajo, con el
               mismo peso. Aqui, cuando se hizo y que persona de la clinica lo
               hizo, solo para el personal de Suminia: al proveedor el que le
               compra es Suminia, no una persona de la clinica. */
            <div className='order-meta'>
              <span className='order-meta-item'>
                <Calendar size={16} />
                <span className='font-light'>Fecha</span>
                <strong>{formatDate(order.createdAt)}</strong>
              </span>
              <span className='order-meta-item'>
                <User size={16} />
                <span className='font-light'>Hecho por</span>
                <strong>{order.placedByName}</strong>
              </span>
            </div>
          ) : (
            /* Comprador y proveedor no saben nada el uno del otro: el
               encabezado no nombra a la otra empresa. Al proveedor el pedido
               le llega como la orden de compra de Suminia. */
            <>
              {/* El numero resaltado: es como cada empresa nombra el pedido
                  al hablar con Suminia. */}
              <h1 className='order-title'>
                {side === 'supplier' ? 'Orden de compra' : 'Pedido'}
                <span className='order-title-code'>{order.code}</span>
              </h1>
              <div className='order-meta'>
                <span className='order-meta-item'>
                  <Calendar size={16} />
                  <span className='font-light'>Fecha</span>
                  {/* Al proveedor la orden se le emite cuando Suminia verifica
                      el pago —a credito, de una vez—, no cuando la clinica
                      hizo el pedido. */}
                  <strong>
                    {formatDate(
                      side === 'supplier' ? (order.paidAt ?? order.createdAt) : order.createdAt,
                    )}
                  </strong>
                </span>
              </div>
            </>
          )}
        </div>
        <span className={`badge ${displayStatus(order, side).className}`}>
          {displayStatus(order, side).label}
        </span>
      </div>

      {/* Para el personal, las dos operaciones del pedido con el mismo peso:
          Suminia le vende al comprador y le compra al proveedor, y cada una
          tiene su numero. Cada empresa solo conoce el suyo; Suminia, los dos. */}
      {side === 'staff' && (
        <div className='order-codes'>
          <div className='order-code-card'>
            <span className='order-code-line'>
              <span className='order-code-label'>Proveedor</span>
              <Link
                href={`/admin/suppliers/${order.supplierOrganizationId}`}
                className='order-code-org'
              >
                {order.supplierOrganizationName}
              </Link>
            </span>
            <span className='order-code-line'>
              <strong className='order-code-value'>{order.purchaseCode ?? '—'}</strong>
              <span className='font-light'>Orden de compra</span>
            </span>
          </div>

          {/* Por donde va la mercancia y la plata del pedido: Suminia le
              compra al proveedor y le vende al comprador. */}
          <div className='order-codes-flow' aria-hidden='true'>
            <ArrowRight size={18} />
            <span className='order-codes-hub'>Suminia</span>
            <ArrowRight size={18} />
          </div>

          <div className='order-code-card'>
            <span className='order-code-line'>
              <span className='order-code-label'>Comprador</span>
              <Link href={`/admin/buyers/${order.buyerOrganizationId}`} className='order-code-org'>
                {order.buyerOrganizationName}
              </Link>
            </span>
            <span className='order-code-line'>
              <strong className='order-code-value'>{order.code}</strong>
              <span className='font-light'>Pedido de venta</span>
            </span>
          </div>
        </div>
      )}

      {/* El recorrido y lo que significa el punto en el que esta, juntos y en
          su propia caja. Antes la frase iba suelta bajo el titulo y la linea de
          estados debajo, sin nada que las relacionara. */}
      <Panel className='order-state'>
        {/* Lo que significa el estado y, en la misma fila, el despacho
            parcial si lo hubo: el pedido enlazado resaltado al lado. */}
        <div className='order-hint'>
          <p className='mb-0'>
            {side === 'buyer' && !order.closed && !esperandoPago
              ? buyerHint(order)
              : order.closed
              ? closedHint(order, side)
              : deliveredHint(order, side) ??
                (esperandoPago
                ? order.paymentStatus === 'SUBMITTED'
                  ? side === 'buyer'
                    ? 'Estamos verificando tu pago.'
                    : 'Pago por verificar.'
                  : side === 'buyer'
                    ? 'Esperando tu pago.'
                    : 'Esperando el pago del comprador.'
                : (side === 'supplier' && ORDER_STATUS_HINT_SUPPLIER[order.status]) ||
                  ORDER_STATUS_HINT[order.status])}
          </p>

          {/* Un despacho parcial deja dos pedidos enlazados: el primero, con
              lo que habia, y la segunda entrega, con lo que falto. Cada uno
              dice donde esta el otro, para no perder el hilo. Si la fecha
              prevista ya paso y todavia no sale, se marca atrasada. */}
          {order.backorderOf && (
            <span className={`order-hint-tag${segundaAtrasada(order) ? ' is-late' : ''}`}>
              <Package size={14} />
              Segunda entrega de{' '}
              <Link href={`${copy.basePath}/${order.backorderOf.id}`}>
                {order.backorderOf.code}
              </Link>
              {order.restockDate &&
                (segundaAtrasada(order)
                  ? ` · Atrasada: era para el ${formatDay(order.restockDate)}`
                  : ` · Fecha prevista: ${formatDay(order.restockDate)}`)}
            </span>
          )}
          {order.backorders.length > 0 && (
            <span className='order-hint-tag'>
              <Package size={14} />
              {side === 'buyer' ? 'Llega' : 'Se despacha'} en{' '}
              {order.backorders.length === 1 ? 'dos' : order.backorders.length + 1} entregas ·{' '}
              {order.backorders.length === 1 ? 'la segunda es' : 'las siguientes son'}{' '}
              {order.backorders.map((pendiente, indice) => (
                <span key={pendiente.id}>
                  {indice > 0 && ', '}
                  <Link href={`${copy.basePath}/${pendiente.id}`}>{pendiente.code}</Link>
                </span>
              ))}
            </span>
          )}
        </div>

        {/* La novedad del proveedor, para el y para Suminia —al comprador no
            le llega—. Mientras la orden esta devuelta o esperando respuesta;
            resuelta la novedad, ya no es lo que pasa con ella. */}
        {novedad && (
          <div className='alert alert-warning'>
            <strong>Novedad reportada:</strong> {novedad}
            {order.statusReason && order.statusReason !== novedad && (
              <span className='d-block'>{order.statusReason}</span>
            )}
          </div>
        )}
        {/* El motivo llega solo a quien lo escribio y a Suminia: el backend
            se lo quita al otro lado. */}
        {!novedad && order.statusReason && order.status !== 'AWAITING_BUYER' && (
          <div className='alert alert-warning'>
            <strong>Motivo:</strong> {order.statusReason}
          </div>
        )}

        {side === 'supplier' && order.backorderOf && !order.stockReserved && (
          <div className='alert alert-warning'>
            Al confirmarlo se descuenta de tus existencias: cárgalas antes.
          </div>
        )}
        {order.quote && side !== 'supplier' && (
          <div className='alert alert-info'>
            Pedido generado a partir de la cotización{' '}
            {side === 'buyer' ? (
              <Link href={`/buyer/account/quotes/${order.quote.id}`}>{order.quote.code}</Link>
            ) : (
              order.quote.code
            )}
            , con los precios cotizados.
          </div>
        )}

        <Timeline order={order} side={side} />
      </Panel>

      {/* Dos columnas: a la izquierda lo que se pidio, que es lo que mas ocupa;
          a la derecha lo que hay que hacer y los datos de apoyo. En una sola
          columna, el pedido dejaba media pantalla vacia a la derecha y los
          botones acababan al final de todo, despues de la direccion y la nota. */}
      <div className='order-layout'>
        <div className='order-main'>
      {/* Lo que hay que decidir va primero: el proveedor llenando su
          disponibilidad, o el comprador respondiendo a ella. */}
      {side === 'supplier' &&
        reportando &&
        (supplierCanDecide(order.status) || supplierCanCancel(order.status)) && (
          <SupplierIssueForm
            order={order}
            mode={supplierCanDecide(order.status) ? 'reject' : 'cancel'}
            onClose={() => setReportando(false)}
          />
        )}
      {side === 'buyer' && buyerCanAnswerAvailability(order.status) && (
        <BuyerAvailabilityResponse order={order} pesos={pesos} />
      )}

      {/* El mismo titulo para todos, salvo el nombre del documento: antes cada
          lado tenia su frase —"Qué pediste", "Qué te pidieron"— y se leian
          como conversacion. Al proveedor le compra Suminia: para el es una
          orden de compra. */}
      <Panel
        title={side === 'supplier' ? 'Detalles de la orden de compra' : 'Detalles del pedido'}
        aside={
          puedeDescargarOrden && codigoOrdenDeCompra ? (
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              disabled={ordenDeCompra.downloading}
              onClick={() => ordenDeCompra.download(order.id, codigoOrdenDeCompra)}
            >
              <Download size={14} />
              {ordenDeCompra.downloading ? 'Descargando...' : 'Descargar orden de compra'}
            </button>
          ) : undefined
        }
      >
      {/* Una tabla, con una columna por cifra: cantidad, precio, IVA y total
          se leen en vertical y se comparan de un vistazo. Antes iban juntos en
          una sola linea ("2 × $ 890.000") y habia que descifrarlos. Las mismas
          columnas que el PDF de la cotizacion. */}
      <div className='catalog-table-scroll'>
        <table className='catalog-table order-items-table'>
          <thead>
            <tr>
              <th>Producto</th>
              <th className='num'>Cantidad</th>
              <th className='num'>Precio unitario</th>
              <th className='num'>IVA</th>
              <th className='num'>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <Fragment key={item.id}>
              <tr
                id={`producto-${item.id}`}
                className={loteAbierto === item.id ? 'is-expanded' : undefined}
              >
                <td>
                  <span className='order-item-name'>
                    {item.productName}
                    <small className='font-light'>
                      {presentationLabel(item.presentationName, item.packaging)}
                      {item.cum && ` · CUM ${item.cum}`}
                      {/* El codigo de Suminia; al proveedor, su propio SKU. */}
                      {side === 'supplier' && item.sku
                        ? ` · SKU ${item.sku}`
                        : ` · ${item.referenceCode}`}
                    </small>
                    <OrderItemLotInfo
                      item={item}
                      editable={anotaLotes}
                      open={loteAbierto === item.id}
                      onToggle={() =>
                        setLoteAbierto((actual) => (actual === item.id ? null : item.id))
                      }
                    />
                  </span>
                </td>
                <td className='num is-nowrap'>
                  {item.quantity}
                  {order.status === 'AWAITING_BUYER' && item.availableQuantity !== null && (
                    <small className='font-light d-block'>
                      disponibles {item.availableQuantity}
                    </small>
                  )}
                </td>
                <td className='num is-nowrap'>{pesos(item.unitPrice, order.currency)}</td>
                <td className='num is-nowrap'>{Math.round(item.taxRate * 100)}%</td>
                <td className='num is-nowrap'>
                  <strong>{pesos(item.total, order.currency)}</strong>
                </td>
              </tr>
              {anotaLotes && loteAbierto === item.id && (
                <tr className='order-item-lot-row'>
                  <td colSpan={5}>
                    <OrderItemLotForm
                      orderId={order.id}
                      item={item}
                    />
                  </td>
                </tr>
              )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <ul className='cart-summary-lines order-totals'>
        <li>
          <span className='font-light'>Subtotal</span>
          <span>{pesos(order.subtotal, order.currency)}</span>
        </li>
        <li>
          <span className='font-light'>IVA</span>
          <span>{pesos(order.tax, order.currency)}</span>
        </li>
        <li>
          <span className='font-light'>Envío</span>
          <span>{order.shippingCost > 0 ? pesos(order.shippingCost, order.currency) : 'Gratis'}</span>
        </li>
        <li className='cart-summary-total'>
          <span>Total</span>
          <strong>{pesos(order.total, order.currency)}</strong>
        </li>
        {/* En la orden de compra, cuando le paga Suminia: es parte de lo que
            el proveedor confirma al aceptarla. */}
        {side === 'supplier' && (
          <li>
            <span className='font-light'>Condición de pago</span>
            <strong>{condicionDePago(order.supplierPaymentTermDays)}</strong>
          </li>
        )}
      </ul>
      </Panel>

      <OrderNotesPanel order={order} side={side} />

      {/* Confirmada la orden, despacharla es lo que le queda al proveedor: el
          formulario va abierto debajo del detalle, no detras de un boton. */}
      {side === 'supplier' && puedeDespachar && (
        <SupplierShipmentForm
          order={order}
          onGoToItem={(itemId) => {
            setLoteAbierto(itemId);
            document
              .getElementById(`producto-${itemId}`)
              ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
      )}

      <OrderDeliveryPanel order={order} side={side} />

      <OrderHistoryPanel order={order} side={side} />
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
        {/* Confirmada la orden, lo que sigue es despacharla. El formulario esta
            en la columna principal, debajo del detalle y fuera de la vista: el
            aviso dice que falta y lleva hasta el. */}
        {side === 'supplier' && puedeDespachar && (
          <>
            <p className='order-next-hint w-100'>
              <Check size={16} />
              Orden confirmada. Falta registrar el despacho.
            </p>
            <button
              type='button'
              className='btn btn-primary btn-sm btn-with-icon'
              onClick={() => {
                const destino = document.getElementById(SHIPMENT_FORM_ID);
                destino?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                destino?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
              }}
            >
              <Truck size={14} />
              Llenar información de despacho
            </button>
          </>
        )}

        {/* Dos salidas y no tres: o la atiende como se emitio, o reporta una
            novedad con su motivo. La disponibilidad parcial es uno de los
            motivos, y lleva a su formulario de cantidades. */}
        {side === 'supplier' && supplierCanDecide(order.status) && (
          <>
            <p className='font-light mb-0 w-100'>
              Al confirmar, te comprometes a atender esta orden de compra con las
              cantidades, precios, condiciones de pago y plazos de entrega indicados.
            </p>
            <button
              type='button'
              className='btn btn-primary btn-sm'
              disabled={isSaving || reportando}
              onClick={() => mover('CONFIRMED', 'Orden confirmada. Ya puedes prepararla')}
            >
              Confirmar pedido
            </button>
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm'
              disabled={isSaving || reportando}
              onClick={() => setReportando(true)}
            >
              Reportar novedad
            </button>
          </>
        )}

        {/* La entrega se confirma con su prueba: el formulario esta en la
            columna principal, y el boton lleva hasta el. */}
        {side === 'supplier' && supplierCanConfirmDelivery(order.status) && (
          <button
            type='button'
            className='btn btn-primary btn-sm'
            onClick={() => {
              const destino = document.getElementById(DELIVERY_FORM_ID);
              destino?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              destino?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
            }}
          >
            Confirmar entrega
          </button>
        )}

        {/* Ya confirmada, la novedad la cancela: con el mismo motivo de la
            lista, para que Suminia la cuente igual. */}
        {side === 'supplier' && supplierCanCancel(order.status) && (
          <button
            type='button'
            className='btn btn-outline-secondary btn-sm'
            disabled={isSaving || reportando}
            onClick={() => setReportando(true)}
          >
            Reportar novedad
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
              Solo lo lee Suminia.
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
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
      </Panel>
      )}

      {/* Con que salio, para el proveedor y para Suminia. Al comprador no le
          llega: la guia lleva el remitente. */}
      {order.carrierName && (
        <Panel title='Despacho'>
          <ul className='data-list is-single'>
            <li>
              <span className='font-light'>Transportadora</span>
              <span>{order.carrierName}</span>
            </li>
            <li>
              <span className='font-light'>Número de guía</span>
              <span>{order.trackingNumber ?? '—'}</span>
            </li>
            {order.estimatedDeliveryAt && (
              <li>
                <span className='font-light'>Entrega estimada</span>
                <span>{formatDeliveryDate(order.estimatedDeliveryAt)}</span>
              </li>
            )}
          </ul>
        </Panel>
      )}

      {/* El reclamo arriba de todo: si hay uno abierto es lo que hay que
          atender, y al comprador es donde se le ofrece reclamar. */}
      <OrderClaimPanel order={order} side={side} />
      {/* Despues del reclamo, la liquidacion: cuando el pedido ya se entrego es
          lo unico que le queda pendiente a Suminia. */}
      {PayoutPanel && order.supplierOrganizationId && (
        <PayoutPanel
          orderId={order.id}
          supplierOrganizationId={order.supplierOrganizationId}
          payout={order.payout}
        />
      )}
      <OrderPaymentPanel order={order} side={side} />
      {/* Cada lado ve su factura: el comprador la de Suminia, el proveedor la
          suya a Suminia. El personal de Suminia, las dos. */}
      {side !== 'supplier' && <OrderInvoicePanel order={order} side={side} variant='suminia' />}
      {side !== 'buyer' && <OrderInvoicePanel order={order} side={side} variant='supplier' />}

      {/* Al proveedor la entrega se le retira 90 dias despues de cerrado el
          pedido: la necesitaba para despachar, y cerrado ya no. Queda para el
          personal de Suminia. El panel se queda con la explicacion, para que
          no parezca que falta algo. */}
      <Panel title='Dirección de entrega'>
      {entrega ? (
      <div className='order-delivery'>
        <p className='location-address'>
          <MapPin size={14} />
          <span>
            <strong>{entrega.name}</strong>
            <br />
            {entrega.address} ·{' '}
            {formatPlace(entrega.city, entrega.department)}
          </span>
        </p>
        <ul className='location-details'>
          {entrega.contact && <li>{entrega.contact}</li>}
          {entrega.phone && <li>{entrega.phone}</li>}
          {entrega.hours && <li>{entrega.hours}</li>}
        </ul>
        {entrega.notes && (
          <p className='location-notes font-light'>{entrega.notes}</p>
        )}
        {/* Lo que el comprador escribio para esta entrega —el piso, el
            consultorio, la orden de compra—. Va con la direccion porque es
            de la entrega: antes era un panel aparte, "Tu nota al proveedor",
            que se confundia con un canal para reportar novedades. */}
        {order.buyerNotes && (
          <p className='order-delivery-notes'>
            <strong>{copy.nota}</strong>
            <span>{order.buyerNotes}</span>
          </p>
        )}
      </div>
      ) : (
        <p className='font-light mb-0'>
          {order.deliveryRetired
            ? 'Los datos de entrega se retiran 3 meses después de cerrada la orden. Si los necesitas, pídeselos a Suminia.'
            : 'Sin datos de entrega.'}
        </p>
      )}
      </Panel>

      {/* La liquidacion. El proveedor mira lo que le queda; el personal de
          Suminia, lo que se queda Suminia. Es el mismo desglose leido desde los
          dos lados, y el backend le manda las cifras a los dos —al comprador
          no: el paga el total y punto—. */}
      {side !== 'buyer' && order.supplierPayout !== null && (
        <Panel title={side === 'staff' ? 'Margen y liquidación' : 'Lo que recibes'}>
          {/* Suminia le compra al proveedor a sus precios y le vende a la
              institucion con el incremento: el equipo ve la venta, el costo y
              lo que queda; el proveedor, solo lo que se le paga. */}
          <ul className='cart-summary-lines order-totals'>
            {side === 'staff' && order.costSubtotal !== null && (
              <>
                <li>
                  <span className='font-light'>Venta, antes de IVA</span>
                  <span>{pesos(order.subtotal, order.currency)}</span>
                </li>
                <li>
                  <span className='font-light'>Costo del proveedor, antes de IVA</span>
                  <span>−{pesos(order.costSubtotal, order.currency)}</span>
                </li>
                <li>
                  <span className='font-light'>
                    Margen de Suminia
                    {order.commissionRate !== null &&
                      ` (incremento de ${String(order.commissionRate).replace('.', ',')}%)`}
                  </span>
                  <span>{pesos(order.commissionAmount ?? 0, order.currency)}</span>
                </li>
              </>
            )}
            <li className='cart-summary-total'>
              <span>
                {side === 'staff' ? 'Valor a pagar al proveedor' : 'Valor a recibir'}
                <small className='font-light d-block'>
                  {composicionDelPago(order.costTax ?? order.tax, order.shippingCost)}
                </small>
              </span>
              <strong>{pesos(order.supplierPayout, order.currency)}</strong>
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

import type {
  ClaimReason,
  Order,
  OrderEventType,
  OrderStatus,
  PaymentMethod,
} from '../model/order.types';

/* Como se cuenta el estado de un pedido, y que puede hacer cada lado.

   Las mismas reglas que valida el backend, repetidas aqui para no ofrecer
   botones que van a responder 422. Quien decide es el servidor: esto solo evita
   que el error ocurra. */

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: 'Pedido hecho',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Despachado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REJECTED: 'Rechazado',
  AWAITING_BUYER: 'Disponibilidad parcial',
};

/* Lo que significa para quien lo mira, que es distinto de como se llama. */
export const ORDER_STATUS_HINT: Record<OrderStatus, string> = {
  PLACED: 'Esperando que el proveedor lo confirme.',
  CONFIRMED: 'El proveedor lo aceptó.',
  SHIPPED: 'Va en camino.',
  DELIVERED: 'Recibido.',
  CANCELLED: 'Se canceló.',
  REJECTED: 'El proveedor no pudo atenderlo.',
  AWAITING_BUYER: 'El proveedor no tiene todo lo que pediste. Revisa su propuesta y decide.',
};

/* Lo mismo dicho al proveedor, donde cambia. */
export const ORDER_STATUS_HINT_SUPPLIER: Partial<Record<OrderStatus, string>> = {
  AWAITING_BUYER: 'Enviaste tu disponibilidad. Esperando a que el comprador decida.',
};

/* Las mismas clases de color que las empresas, para que un pedido y una empresa
   no hablen dos idiomas distintos. Amarillo lo que espera, azul lo que avanza,
   verde lo que llego, gris y rojo lo que no salio. */
export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  PLACED: 'bg-warning',
  CONFIRMED: 'bg-primary',
  SHIPPED: 'bg-info',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-secondary',
  REJECTED: 'bg-danger',
  AWAITING_BUYER: 'bg-warning',
};

export const ORDER_IS_OPEN = (status: OrderStatus): boolean =>
  !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(status);

/* El comprador solo puede cancelar antes de que el proveedor se comprometa, o
   cuando le proponen un despacho parcial y no le sirve. */
export const buyerCanCancel = (status: OrderStatus): boolean =>
  status === 'PLACED' || status === 'AWAITING_BUYER';

/** Y responder a la propuesta de despacho parcial. */
export const buyerCanAnswerAvailability = (status: OrderStatus): boolean =>
  status === 'AWAITING_BUYER';

/** Y dar por recibido lo que ya salio. */
export const buyerCanConfirmDelivery = (status: OrderStatus): boolean =>
  status === 'SHIPPED';

/** El proveedor decide sobre lo que todavia no ha mirado. */
export const supplierCanDecide = (status: OrderStatus): boolean =>
  status === 'PLACED';

/** Despacha lo que ya acepto. */
export const supplierCanShip = (status: OrderStatus): boolean =>
  status === 'CONFIRMED';

/* Y puede echarse atras de lo confirmado mientras no haya salido. Con motivo:
   el comprador conto con esa mercancia. */
export const supplierCanCancel = (status: OrderStatus): boolean =>
  status === 'CONFIRMED';

/* Tambien puede darlo por entregado: a veces tiene la firma del transportador
   antes de que el comprador entre a confirmarlo. */
export const supplierCanConfirmDelivery = (status: OrderStatus): boolean =>
  status === 'SHIPPED';

/* El recorrido que se dibuja en la ficha. Los estados que matan el pedido no
   entran: no son un paso mas, son el final. */
/* Esperar la respuesta del comprador no es un paso del recorrido: el pedido
   sigue sin confirmar. Se dibuja donde estaba. */
export const TIMELINE_POSITION: Partial<Record<OrderStatus, OrderStatus>> = {
  AWAITING_BUYER: 'PLACED',
};

export const ORDER_TIMELINE: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
];

/* ------------------------------------------------------------------------
   El dinero del pedido

   Por transferencia: se paga apenas se hace el pedido, y el proveedor no lo
   ve hasta que Suminia verifica el pago; si despues no lo puede atender,
   Suminia devuelve la plata. A credito: el proveedor lo ve de una vez, lo
   despacha y se paga despues de la entrega. Las mismas reglas que el backend.
   ------------------------------------------------------------------------ */

type MoneyView = Pick<
  Order,
  'status' | 'paymentStatus' | 'paymentMethod' | 'invoice' | 'paymentDueAt' | 'refundAmount' | 'refund'
>;

const MUERTO: OrderStatus[] = ['CANCELLED', 'REJECTED'];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  TRANSFER: 'Transferencia',
  CREDIT: 'Crédito',
};

/* Lo que se dice del pago en una fila de la lista y en la ficha. Null cuando
   no hay nada que decir: un pedido que todavia no confirma el proveedor no
   tiene pago pendiente, y uno muerto sin pagar tampoco. */
export const paymentSummary = (
  order: MoneyView,
  side: 'buyer' | 'supplier' | 'staff',
): { label: string; tone: 'success' | 'neutral' | 'danger' | 'muted' } | null => {
  if (order.paymentStatus === 'REFUNDED') return { label: 'Pago devuelto', tone: 'muted' };
  if (needsRefund(order)) {
    return { label: side === 'buyer' ? 'Te devolvemos plata' : 'Por devolver', tone: 'danger' };
  }
  if (MUERTO.includes(order.status)) return null;
  if (order.paymentStatus === 'PAID') return { label: 'Pagado', tone: 'success' };
  if (order.paymentStatus === 'SUBMITTED') {
    return { label: 'Pago en verificación', tone: 'neutral' };
  }
  if (order.paymentMethod === 'CREDIT') {
    const vencido =
      order.paymentDueAt !== null && new Date(order.paymentDueAt) < new Date();
    return vencido
      ? { label: 'Crédito vencido', tone: 'danger' }
      : { label: 'A crédito', tone: 'muted' };
  }
  if (order.status === 'PLACED' || order.status === 'CONFIRMED') {
    return { label: side === 'buyer' ? 'Por pagar' : 'Esperando el pago', tone: 'neutral' };
  }
  return null;
};

export const TONE_PILL: Record<'success' | 'neutral' | 'danger' | 'muted', string> = {
  success: 'status-success',
  neutral: 'status-neutral',
  danger: 'status-danger',
  muted: 'status-muted',
};

/** El comprador puede subir su comprobante. */
export const buyerCanPay = (order: MoneyView): boolean => {
  if (MUERTO.includes(order.status) || order.paymentStatus !== 'PENDING') return false;
  /* CONFIRMED por transferencia queda por los pedidos de antes del cambio,
     que se pagaban al confirmar. */
  return order.paymentMethod === 'TRANSFER'
    ? order.status === 'PLACED' || order.status === 'CONFIRMED'
    : ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status);
};

/** Por transferencia, el proveedor espera el pago verificado para despachar. */
export const supplierWaitsPayment = (order: MoneyView): boolean =>
  order.status === 'CONFIRMED' &&
  order.paymentMethod === 'TRANSFER' &&
  order.paymentStatus !== 'PAID';

/** La factura se adjunta desde la confirmacion; una vez, y se puede corregir. */
export const supplierCanInvoice = (order: MoneyView): boolean =>
  ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status);

/* Hay que devolverle plata al comprador: el pedido pagado se cayo entero, o
   el proveedor solo atendio una parte. */
export const needsRefund = (order: Pick<Order, 'status' | 'paymentStatus' | 'refundAmount' | 'refund'>): boolean =>
  order.paymentStatus === 'PAID' &&
  !order.refund &&
  (order.refundAmount !== null ? order.refundAmount > 0 : MUERTO.includes(order.status));

/** Cuanto se devuelve. */
export const refundDue = (order: Pick<Order, 'status' | 'total' | 'refundAmount'>): number =>
  order.refundAmount ?? (MUERTO.includes(order.status) ? order.total : 0);

/* Como se cuenta cada paso del historial. */
export const ORDER_EVENT_LABEL: Record<OrderEventType, string> = {
  PLACED: 'Pedido hecho',
  CONFIRMED: 'Confirmado por el proveedor',
  REJECTED: 'Rechazado por el proveedor',
  CANCELLED: 'Cancelado',
  AVAILABILITY_PROPOSED: 'El proveedor propuso un despacho parcial',
  AVAILABILITY_ACCEPTED: 'El comprador aceptó el despacho parcial',
  PAYMENT_SUBMITTED: 'Comprobante de pago enviado',
  PAYMENT_APPROVED: 'Pago verificado por Suminia',
  PAYMENT_REJECTED: 'Comprobante rechazado por Suminia',
  PAYMENT_EXPIRED: 'Cancelado: no se recibió el pago a tiempo',
  SHIPPED: 'Despachado',
  INVOICE_ATTACHED: 'El proveedor adjuntó su factura a Suminia',
  SUMINIA_INVOICE_ATTACHED: 'Suminia emitió la factura al comprador',
  DELIVERED: 'Entregado',
  CLAIM_OPENED: 'El comprador abrió un reclamo',
  CLAIM_RESOLVED: 'Suminia resolvió el reclamo',
  REFUNDED: 'Pago devuelto al comprador',
  PAYOUT_PAID: 'Liquidado al proveedor',
};

/* El estado que se muestra. Un pedido entregado pasa a "Cerrado" cuando se
   cierra para quien lo mira —el comprador al pasar los dias de reclamo,
   Suminia y el proveedor al pagarse la liquidacion—: el backend lo calcula y
   manda `closed`. */
export const displayStatus = (
  order: Pick<Order, 'status' | 'closed' | 'claims'>,
): { label: string; className: string } =>
  order.claims.some((claim) => claim.status === 'OPEN')
    ? { label: 'En reclamo', className: 'bg-danger' }
    : order.closed
    ? { label: 'Cerrado', className: 'bg-secondary' }
    : { label: ORDER_STATUS_LABEL[order.status], className: ORDER_STATUS_CLASS[order.status] };

/* Lo que significa estar cerrado, para cada lado. */
export const CLOSED_HINT: Record<'buyer' | 'supplier' | 'staff', string> = {
  buyer: 'Recibido. Pasaron los días de reclamo: el pedido quedó cerrado.',
  supplier: 'Entregado y liquidado: el pedido quedó cerrado.',
  staff: 'Entregado y liquidado al proveedor: el pedido quedó cerrado.',
};

export const CLAIM_REASON_LABEL: Record<ClaimReason, string> = {
  DEFECTIVE: 'Producto defectuoso',
  WRONG_PRODUCT: 'Producto incorrecto',
  MISSING_ITEMS: 'Faltaron productos',
  DAMAGED: 'Llegó en mal estado',
  OTHER: 'Otro problema',
};

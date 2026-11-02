import type {
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

   Por transferencia: se paga cuando el proveedor confirma —asi un rechazo no
   deja nada que devolver— y el proveedor no despacha hasta que Suminia
   verifica el pago. A credito: se despacha sin pago y se paga despues de la
   entrega. Las mismas reglas que el backend.
   ------------------------------------------------------------------------ */

type MoneyView = Pick<
  Order,
  'status' | 'paymentStatus' | 'paymentMethod' | 'invoice' | 'paymentDueAt'
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
  if (MUERTO.includes(order.status)) {
    return order.paymentStatus === 'PAID'
      ? { label: side === 'buyer' ? 'Te devolvemos el pago' : 'Por devolver', tone: 'danger' }
      : null;
  }
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
  if (order.status === 'CONFIRMED') {
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
  return order.paymentMethod === 'TRANSFER'
    ? order.status === 'CONFIRMED'
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

/** Un pedido pagado que se cayo: Suminia le devuelve la plata al comprador. */
export const needsRefund = (order: MoneyView): boolean =>
  order.paymentStatus === 'PAID' && MUERTO.includes(order.status);

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
  INVOICE_ATTACHED: 'Factura adjuntada',
  DELIVERED: 'Entregado',
  REFUNDED: 'Pago devuelto al comprador',
  PAYOUT_PAID: 'Liquidado al proveedor',
};

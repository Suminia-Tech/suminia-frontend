import type { OrderStatus } from '../model/order.types';

/* Como se cuenta el estado de un pedido, y que puede hacer cada lado.

   Las mismas reglas que valida el backend, repetidas aqui para no ofrecer
   botones que van a responder 422. Quien decide es el servidor: esto solo evita
   que el error ocurra. */

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: 'Pedido hecho',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Despachado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Anulado',
  REJECTED: 'Rechazado',
};

/* Lo que significa para quien lo mira, que es distinto de como se llama. */
export const ORDER_STATUS_HINT: Record<OrderStatus, string> = {
  PLACED: 'Esperando que el proveedor lo confirme.',
  CONFIRMED: 'El proveedor lo aceptó y lo va a despachar.',
  SHIPPED: 'Va en camino.',
  DELIVERED: 'Recibido.',
  CANCELLED: 'Se anuló.',
  REJECTED: 'El proveedor no pudo atenderlo.',
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
};

export const ORDER_IS_OPEN = (status: OrderStatus): boolean =>
  !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(status);

/** El comprador solo puede anular antes de que el proveedor se comprometa. */
export const buyerCanCancel = (status: OrderStatus): boolean =>
  status === 'PLACED';

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
export const ORDER_TIMELINE: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
];

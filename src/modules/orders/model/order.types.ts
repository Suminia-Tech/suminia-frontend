/* Contrato de los pedidos con el backend.

   Casi todo viene copiado del momento en que se hizo el pedido y no apunta al
   catalogo: el nombre del producto, el precio que costo, la direccion a donde
   iba. Un pedido es un acuerdo de una fecha, y tiene que poder leerse igual
   dentro de dos años aunque el proveedor haya renombrado el producto. */

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'
  /* El proveedor no tiene todo: dijo cuanto tiene y para cuando llega el
     resto, y espera a que el comprador decida. */
  | 'AWAITING_BUYER';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';
export type PayoutStatus = 'PENDING' | 'PAID';

export interface OrderItem {
  id: string;
  presentationId: string;
  productName: string;
  presentationName: string;
  packaging: string;
  sku: string | null;
  cum: string | null;
  quantity: number;
  /** Lo que el proveedor dijo tener, si propuso un despacho parcial. */
  availableQuantity: number | null;
  unitPrice: number;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
}

export interface OrderDelivery {
  locationId: string;
  name: string;
  address: string;
  city: string;
  department: string | null;
  contact: string | null;
  phone: string | null;
  hours: string | null;
  notes: string | null;
}

export interface Order {
  id: string;
  /** Clave interna. Para nombrar el pedido se usa `code`. */
  number: number;
  /** Como se nombra el pedido: SUM-2026-010257. */
  code: string;
  /* Falso solo en un pendiente de despacho parcial que no se ha confirmado:
     todavia no aparta inventario. */
  stockReserved: boolean;
  /** Para cuando promete el proveedor lo que falta (YYYY-MM-DD...). */
  restockDate: string | null;
  /** El pedido del que salio este pendiente. */
  backorderOf: { id: string; code: string } | null;
  /** Los pendientes que salieron de este. */
  backorders: { id: string; code: string; status: OrderStatus }[];

  buyerOrganizationId: string;
  buyerOrganizationName: string;
  supplierOrganizationId: string;
  supplierOrganizationName: string;
  placedByUserId: string;
  placedByName: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  payoutStatus: PayoutStatus;
  statusReason: string | null;

  delivery: OrderDelivery;
  buyerNotes: string | null;

  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;

  /* Null para el comprador: lo que se queda Suminia no le incumbe. Lo ven el
     proveedor, para cuadrar lo que le van a consignar, y el equipo interno. */
  commissionRate: number | null;
  commissionAmount: number | null;
  supplierPayout: number | null;

  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrdersRequest {
  /** Sin ella se usa la sede predeterminada de la empresa. */
  deliveryLocationId?: string;
  notes?: string;
}

export interface ChangeOrderStatusRequest {
  id: string;
  status: OrderStatus;
  reason?: string;
}

/* El proveedor no tiene todo: cuanto tiene de cada producto y para cuando
   llega el resto. */
export interface ProposeAvailabilityRequest {
  id: string;
  items: { itemId: string; availableQuantity: number }[];
  restockDate: string;
  note?: string;
}

/* La respuesta del comprador: cuanto recibe ya y cuanto deja pendiente. */
export interface AcceptAvailabilityRequest {
  id: string;
  items: { itemId: string; quantity: number; backorderQuantity: number }[];
}

/* La facturacion de la plataforma en un mes, para el personal de Suminia: lo
   que se pidio y no se anulo ni se rechazo. */
export interface MonthlyBilling {
  /** "2026-10", en hora de Colombia. */
  month: string;
  orders: number;
  billed: number;
  commission: number;
}

/* Lo que suma un filtro de pedidos, para el personal de Suminia, y con que se
   puede filtrar. El dinero y las unidades cuentan solo lo que no se anulo ni
   se rechazo; `orders` cuenta todos los que deja ver el filtro. */
export interface OrderMetrics {
  orders: number;
  billed: number;
  commission: number;
  units: number;
  options: {
    months: string[];
    categories: { id: string; name: string }[];
    cities: string[];
    departments: string[];
    clientTypes: string[];
  };
}

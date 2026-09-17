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
  | 'REJECTED';

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
  /** Consecutivo legible, para hablar del pedido por telefono. */
  number: number;

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

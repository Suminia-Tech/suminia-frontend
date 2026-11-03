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

/* SUBMITTED: el comprador subio el comprobante y Suminia lo esta verificando. */
export type PaymentStatus = 'PENDING' | 'SUBMITTED' | 'PAID' | 'REFUNDED';
export type PayoutStatus = 'PENDING' | 'PAID';
/* Por transferencia se paga antes del despacho; a credito, despues de la
   entrega, si Suminia le dio credito al comprador. */
export type PaymentMethod = 'TRANSFER' | 'CREDIT';

/* Un comprobante de transferencia. El proveedor no los recibe: le basta con
   saber si el pago esta. */
export interface OrderPayment {
  id: string;
  amount: number;
  reference: string | null;
  storageKey: string;
  filename: string | null;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  reviewNote: string | null;
  submittedByName: string;
  reviewedByName: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export type OrderEventType =
  | 'PLACED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'AVAILABILITY_PROPOSED'
  | 'AVAILABILITY_ACCEPTED'
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'PAYMENT_EXPIRED'
  | 'SHIPPED'
  | 'INVOICE_ATTACHED'
  | 'SUMINIA_INVOICE_ATTACHED'
  | 'DELIVERED'
  | 'CLAIM_OPENED'
  | 'CLAIM_RESOLVED'
  | 'REFUNDED'
  | 'PAYOUT_PAID';

export type ClaimReason = 'DEFECTIVE' | 'WRONG_PRODUCT' | 'MISSING_ITEMS' | 'DAMAGED' | 'OTHER';

/* Un reclamo del comprador sobre lo entregado. Mientras este abierto, el
   pedido no se cierra ni se le liquida al proveedor. */
export interface OrderClaim {
  id: string;
  reason: ClaimReason;
  description: string;
  status: 'OPEN' | 'RESOLVED';
  createdByName: string;
  resolution: string | null;
  resolvedByName: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

/* Un paso del historial: quien hizo que y cuando. */
export interface OrderEvent {
  id: string;
  type: OrderEventType;
  actorName: string | null;
  actorSide: 'buyer' | 'supplier' | 'staff' | 'system';
  note: string | null;
  createdAt: string;
}

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

  paymentMethod: PaymentMethod;
  creditDays: number | null;
  /** Hasta cuando hay para pagar. */
  paymentDueAt: string | null;
  paidAt: string | null;
  /** Desde cuando entra en una liquidacion. Null para el comprador. */
  payableAt: string | null;
  /** La factura del proveedor a Suminia. Null para el comprador. */
  invoice: {
    number: string;
    storageKey: string | null;
    filename: string | null;
    attachedAt: string;
  } | null;
  /** La factura de Suminia al comprador. Null para el proveedor. */
  suminiaInvoice: {
    number: string;
    storageKey: string | null;
    filename: string | null;
    attachedAt: string;
  } | null;
  /* Cerrado para quien mira: el comprador, cuando pasan los dias de reclamo
     despues de la entrega; Suminia y el proveedor, cuando se le paga al
     proveedor. */
  closed: boolean;
  /** Hasta cuando puede reclamar el comprador. Null si no esta entregado. */
  claimableUntil: string | null;
  claims: OrderClaim[];
  /** La liquidacion en que se le pago al proveedor. Null para el comprador. */
  payout: { id: string; code: string; status: PayoutStatus } | null;
  /** Lo que hay que devolver de un pedido pagado atendido en parte. */
  refundAmount: number | null;
  refund: {
    at: string;
    storageKey: string | null;
    filename: string | null;
    note: string | null;
  } | null;
  quote: { id: string; code: string } | null;
  /* Solo en el detalle; vacios en el listado. */
  payments: OrderPayment[];
  events: OrderEvent[];

  delivery: OrderDelivery;
  buyerNotes: string | null;

  items: OrderItem[];
  subtotal: number;
  tax: number;
  /** El envio que fijo el proveedor para la ciudad de entrega. */
  shippingCost: number;
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
  paymentMethod?: PaymentMethod;
}

/* Que archivo del pedido: el comprobante, la factura o la devolucion. */
export type OrderFileKind = 'payment' | 'invoice' | 'refund' | 'suminia_invoice';

export interface SubmitPaymentRequest {
  id: string;
  amount: number;
  reference?: string;
  storageKey: string;
  filename?: string;
}

export interface ReviewPaymentRequest {
  id: string;
  paymentId: string;
  decision: 'APPROVE' | 'REJECT';
  note?: string;
}

export interface AttachInvoiceRequest {
  id: string;
  number: string;
  storageKey: string;
  filename?: string;
}

export interface RecordRefundRequest {
  id: string;
  storageKey: string;
  filename?: string;
  note?: string;
}

/* La cuenta de Suminia a donde transfiere el comprador. */
export interface PaymentInstructions {
  bankName: string | null;
  accountType: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  accountHolderTaxId: string | null;
  breBKey: string | null;
  paymentInstructions: string | null;
  paymentWindowHours: number;
  /** Falso mientras finanzas no registre la cuenta. */
  configured: boolean;
}

/* El credito de la empresa compradora con Suminia. */
export interface CreditStatus {
  enabled: boolean;
  limit: number | null;
  days: number | null;
  used: number;
  available: number;
  overdue: number;
  overdueOrders: number;
  oldestDueAt: string | null;
}

/* La cotizacion formal: el carrito con sus precios, a nombre de Suminia. */
export interface QuoteItem {
  id: string;
  presentationId: string;
  supplierOrganizationId: string;
  supplierName: string;
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

export interface Quote {
  id: string;
  code: string;
  status: 'ACTIVE' | 'CONVERTED';
  /** Paso su vigencia sin convertirse. */
  expired: boolean;
  validUntil: string;
  createdByName: string;
  createdAt: string;
  convertedAt: string | null;
  subtotal: number;
  tax: number;
  /** El envio de los proveedores a la sede principal, cuando se cotizo. */
  shipping: number;
  shippingDetail: { supplierOrganizationId: string; supplierName: string; cost: number; city: string | null }[];
  total: number;
  currency: string;
  buyer: {
    id: string;
    name: string;
    taxId: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
  };
  items: QuoteItem[];
  orders: { id: string; code: string }[];
}

export interface QuoteSummary {
  id: string;
  code: string;
  status: 'ACTIVE' | 'CONVERTED';
  expired: boolean;
  validUntil: string;
  createdByName: string;
  createdAt: string;
  total: number;
  currency: string;
  buyerName: string;
  items: number;
  suppliers: number;
}

export interface ConvertQuoteRequest {
  id: string;
  deliveryLocationId?: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
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

/* Lo que costaria el carrito llevado a una sede: el envio de cada proveedor
   depende de la ciudad. Lo enseña el checkout antes de confirmar. */
export interface OrderPreview {
  city: string | null;
  suppliers: {
    supplierOrganizationId: string;
    supplierName: string;
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    freeShippingFrom: number | null;
    /** Lo que falta para el envio gratis, si lo ofrece y no se llega. */
    missingForFreeShipping: number | null;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

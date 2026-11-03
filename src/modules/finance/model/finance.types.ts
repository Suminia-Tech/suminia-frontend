/* Contrato del modulo de finanzas con el backend: las reglas del dinero que
   ajusta finanzas, la comision de cada proveedor, el credito de cada
   comprador, las liquidaciones y el tablero. */

export interface PlatformSettings {
  /** El incremento sobre el costo cuando la linea no define uno. */
  commissionRate: number;
  /* Los supuestos del plan financiero: costos variables en % de ventas,
     gasto fijo del mes, piso de caja, tope de cartera y metas. */
  freightRate: number;
  collectionRate: number;
  returnsRate: number;
  badDebtRate: number;
  otherVariableRate: number;
  monthlyFixedCosts: number;
  cashFloor: number;
  creditPortfolioCap: number;
  targetTicket: number;
  targetFrequency: number;
  targetQuoteConversion: number;

  paymentWindowHours: number;
  paymentReminderHours: number;
  claimWindowDays: number;
  /** 1 lunes ... 5 viernes. */
  payoutWeekday: number;
  quoteValidityDays: number;
  bankName: string | null;
  accountType: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  accountHolderTaxId: string | null;
  breBKey: string | null;
  paymentInstructions: string | null;
  /** El buzon del equipo de Suminia para lo que pide su atencion. */
  staffNotificationEmail: string | null;
  updatedAt: string;
}

export type PlatformSettingsUpdate = Partial<Omit<PlatformSettings, 'updatedAt'>>;

export interface FinanceChange {
  id: string;
  organizationId: string | null;
  field: string;
  label: string;
  oldValue: string | null;
  newValue: string | null;
  userName: string;
  createdAt: string;
}

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

export interface OrganizationFinance {
  organizationId: string;
  name: string;
  type: 'SUPPLIER' | 'BUYER';
  /** Nula: la general. */
  commissionRate: number | null;
  credit: CreditStatus;
  changes: FinanceChange[];
}

export interface CreditPortfolioRow {
  organizationId: string;
  name: string;
  credit: CreditStatus;
}

export interface Amount {
  count: number;
  amount: number;
}

export interface FinanceMonth {
  /** "2026-11". */
  month: string;
  collected: number;
  commission: number;
  paidOut: number;
}

export interface FinanceSummary {
  month: FinanceMonth;
  pending: {
    awaitingPayment: Amount;
    toVerify: Amount;
    readyToPayout: Amount & { suppliers: number };
    payoutsUnpaid: Amount;
    refunds: Amount;
    missingInvoices: number;
    /** Cobrados (o a credito) a los que Suminia no les ha facturado. */
    toInvoiceBuyers: number;
    /** Reclamos sin resolver: frenan el cierre y la liquidacion. */
    openClaims: number;
    credit: { buyers: number; outstanding: number; overdue: number; overdueOrders: number };
  };
  history: FinanceMonth[];
  nextPayoutDate: string;
}

export interface PayoutOrder {
  id: string;
  code: string;
  buyerName: string;
  deliveredAt: string | null;
  payableAt: string | null;
  paymentMethod: 'TRANSFER' | 'CREDIT';
  paymentStatus: string;
  invoiceNumber: string | null;
  total: number;
  commissionRate: number;
  commissionAmount: number;
  supplierPayout: number;
}

export interface Payout {
  id: string;
  code: string;
  status: 'PENDING' | 'PAID';
  supplier: { id: string; name: string };
  orders: number;
  total: number;
  commission: number;
  net: number;
  bankName: string | null;
  accountType: string | null;
  accountNumber: string | null;
  createdByName: string;
  createdAt: string;
  paidAt: string | null;
  paidByName: string | null;
  receipt: { storageKey: string; filename: string | null } | null;
  commissionInvoice: { storageKey: string; filename: string | null } | null;
  note: string | null;
  items: PayoutOrder[];
}

export interface PayableSupplier {
  supplier: {
    id: string;
    name: string;
    bankName: string | null;
    accountType: string | null;
    accountNumber: string | null;
    accountHolder: string | null;
  };
  ready: PayoutOrder[];
  upcoming: PayoutOrder[];
  /** Listos salvo por la factura del proveedor: no entran hasta que la adjunte. */
  blocked: PayoutOrder[];
  readyNet: number;
  upcomingNet: number;
  blockedNet: number;
  missingInvoices: number;
}

export type PayoutFileKind = 'receipt' | 'invoice';

export interface MarkPayoutPaidRequest {
  id: string;
  receiptStorageKey: string;
  receiptFilename?: string;
  commissionInvoiceKey?: string;
  commissionInvoiceFilename?: string;
  note?: string;
}

export type CommercialLine =
  | 'SUPPLIES'
  | 'BASIC_EQUIPMENT'
  | 'HOSPITAL_FURNITURE'
  | 'SIMPLE_DEVICES'
  | 'MEDICINES';

/* Una linea comercial: el incremento sobre el costo con que se vende lo de
   sus categorias, el rango sano y su peso en el plan. */
export interface CommercialLineSetting {
  line: CommercialLine;
  label: string;
  markupRate: number;
  minRate: number;
  maxRate: number;
  planMixRate: number;
  categories: { id: string; name: string }[];
}

export interface PlanMonth {
  month: string;
  newBuyers: number;
  activeBuyers: number;
  sales: number;
  result: number;
}

export interface DashboardMonth {
  month: string;
  sales: number;
  cost: number;
  grossMargin: number;
  variableCosts: number;
  contribution: number;
  fixedCosts: number;
  result: number;
  orders: number;
  activeBuyers: number;
  newBuyers: number;
  plan: { sales: number; newBuyers: number; activeBuyers: number; result: number } | null;
}

/* El tablero 360: lo real del año contra el plan financiero. */
export interface FinanceDashboard {
  year: number;
  years: number[];
  months: DashboardMonth[];
  totals: {
    sales: number;
    grossMargin: number;
    contribution: number;
    result: number;
    orders: number;
    newBuyers: number;
    planSales: number;
    planResult: number;
    planNewBuyers: number;
  };
  rates: {
    grossMargin: number | null;
    contribution: number | null;
    variableCosts: number;
    planGrossMargin: number;
    planContribution: number;
  };
  breakEven: { monthlySales: number; activeBuyers: number; lastMonthSales: number };
  buyers: {
    avgTicket: number | null;
    targetTicket: number;
    frequency: number | null;
    targetFrequency: number;
    repurchase60: { rate: number | null; eligible: number };
  };
  lines: {
    line: CommercialLine;
    label: string;
    sales: number;
    grossMargin: number;
    mix: number | null;
    planMix: number;
    markupRate: number;
    minRate: number;
    maxRate: number;
  }[];
  quotes: { created: number; converted: number; conversion: number | null; target: number };
  credit: { outstanding: number; overdue: number; cap: number };
  fixedCosts: number;
  cashFloor: number;
}

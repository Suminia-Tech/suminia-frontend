/* Contrato del modulo de finanzas con el backend: las reglas del dinero que
   ajusta finanzas, la comision de cada proveedor, el credito de cada
   comprador, las liquidaciones y el tablero. */

export interface PlatformSettings {
  commissionRate: number;
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
  readyNet: number;
  upcomingNet: number;
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

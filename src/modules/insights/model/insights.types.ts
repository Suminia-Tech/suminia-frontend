/* Los indicadores comerciales de Suminia. Ventas es el valor de los pedidos
   que siguen en pie, con IVA y envio: lo que pasa por la plataforma. */

export interface InsightsMonth {
  /** "2026-11". */
  month: string;
  sales: number;
  orders: number;
  commission: number;
  buyers: number;
  newBuyers: number;
}

export interface RankRow {
  id: string;
  name: string;
  sales: number;
  orders: number;
  units?: number;
}

export interface Comparison {
  current: number;
  previous: number;
}

export interface Insights {
  months: InsightsMonth[];
  kpis: {
    sales: Comparison;
    orders: Comparison;
    averageTicket: Comparison;
    commission: Comparison;
    activeBuyers: Comparison;
    activeSuppliers: Comparison;
    cancellationRate: number;
    repeatRate: number;
    quoteConversion: number | null;
    paymentVerificationHours: number | null;
    deliveryDays: number | null;
  };
  topBuyers: RankRow[];
  topSuppliers: RankRow[];
  topProducts: RankRow[];
  categories: RankRow[];
  cities: RankRow[];
  buyerTypes: RankRow[];
  companies: {
    buyers: { active: number; pending: number };
    suppliers: { active: number; pending: number };
  };
  periodMonths: number;
}

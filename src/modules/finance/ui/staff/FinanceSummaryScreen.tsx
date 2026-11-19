'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Check } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';
import {
  PageHeader,
  PageSkeleton,
  Panel,
  TargetBars,
  TrendChart,
  type TrendSeries,
} from '@/shared/ui';
import { CREDIT_AVAILABLE } from '@/shared/config/features';
import { useAppSelector } from '@/store/hooks';

import {
  useGetCreditPortfolioQuery,
  useGetFinanceDashboardQuery,
  useGetFinanceSummaryQuery,
} from '../../api/financeApi';
import { monthName, pesos, pesosCortos, porcentaje } from '../../lib/format';
import {
  DEFAULT_RANGE,
  mesActual,
  mesesEntre,
  presetRange,
  rangoLargo,
} from '../../lib/period';
import type { DashboardMonth, FinanceDashboard, FinanceSummary } from '../../model/finance.types';
import { AnalysisBlock, ChartViews, useRangeControl } from './AnalysisBlock';

/* El tablero de finanzas: lo que espera a alguien, y el plan financiero
   contra lo real.

   Lo pendiente va primero y cada linea lleva a su bandeja: un comprobante sin
   verificar frena un despacho. Despues los analisis, cada uno con sus cifras
   arriba, su grafica mes a mes debajo y su propio periodo en el encabezado:
   el desempeño en el lenguaje de un estado de resultados, el crecimiento de
   la base de compradores, si las ventas cubren lo que cuesta operar, las
   lineas comerciales y como compra la institucion. Al final lo que no es de
   un periodo sino de hoy —el credito— y el dinero que se movio.

   Todo antes de IVA salvo el movimiento de dinero, que es lo que pasa por la
   cuenta. El margen de contribucion y el resultado son estimaciones con los
   supuestos de la configuracion (costos variables, gasto fijo): anticipan la
   contabilidad, no la reemplazan. */
export const FinanceSummaryScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const resumen = useGetFinanceSummaryQuery(undefined, { skip: !hydrated });
  /* El mismo que piden los analisis con su periodo por defecto: se pide una
     vez y sirve para saber si el servidor ya habla de rangos. */
  const tablero = useGetFinanceDashboardQuery(presetRange(DEFAULT_RANGE), { skip: !hydrated });

  if (!hydrated || resumen.isLoading || tablero.isLoading) {
    return <PageSkeleton variant='dashboard' />;
  }
  if (resumen.isError || !resumen.data || tablero.isError || !tablero.data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(resumen.error ?? tablero.error, 'No se pudo cargar el resumen financiero.')}
      </div>
    );
  }
  /* Un backend anterior al tablero por periodos no manda el rango: pasa si el
     frontend se despliega primero. Se avisa en vez de romper la pantalla. */
  if (!tablero.data.data.range) {
    return (
      <div className='alert alert-warning'>
        El servidor todavía no tiene la versión nueva del resumen financiero. Recarga en unos
        minutos.
      </div>
    );
  }

  const summary = resumen.data.data;

  return (
    <>
      <PageHeader
        title='Resumen financiero'
        description='Lo que espera a alguien, y el plan financiero contra lo real. Cifras antes de IVA; cada gráfica tiene su propio período.'
      />

      <PendingPanel summary={summary} />

      <div className='panel-stack'>
        <PerformanceBlock />

        <Panel
          title='Crecimiento y sostenibilidad'
          description='Si la base de compradores crece, y si las ventas alcanzan para cubrir lo que cuesta operar.'
        >
          <div className='panel-subsections is-stacked'>
            <BuyersGrowthBlock />
            <BreakEvenBlock />
          </div>
        </Panel>

        <BuyerBehaviorBlock />
        <LinesBlock />
        {CREDIT_AVAILABLE && <CreditPanel summary={summary} />}
        <MoneyFlowPanel summary={summary} />
      </div>
    </>
  );
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
const entero = (n: number) => n.toLocaleString('es-CO');
const decimal = (n: number) =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(n);

/* La cifra, su comparacion y una nota, en una tarjeta. */
const Kpi = ({
  label,
  value,
  meta,
  note,
}: {
  label: string;
  value: string;
  meta?: ReactNode;
  note?: string;
}) => (
  <div className='kpi-tile'>
    <span className='kpi-label font-light'>{label}</span>
    <span className='kpi-value'>{value}</span>
    {meta && <span className='kpi-change font-light'>{meta}</span>}
    {note && <span className='kpi-change font-light'>{note}</span>}
  </div>
);

const Flecha = ({ sube }: { sube: boolean }) =>
  sube ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />;

/* Contra que se compara, dicho corto: "2025" si son los mismos meses del año
   anterior, "período anterior" si no. El pie del bloque lo dice completo. */
const contraQue = (d: FinanceDashboard) =>
  d.comparison === 'year' ? d.previousRange.from.slice(0, 4) : 'período anterior';

/* "↗ +12,4% vs. 2025": el cambio de una cifra en pesos, en porcentaje. Sin
   nada en el periodo anterior no hay porcentaje que dar, y se dice. */
const variacion = (d: FinanceDashboard, actual: number, anterior: number) => {
  if (anterior === 0) {
    return actual === 0 ? `Sin movimiento, igual que en ${contraQue(d)}` : `Sin movimiento en ${contraQue(d)}`;
  }
  const cambio = ((actual - anterior) / Math.abs(anterior)) * 100;
  return (
    <>
      <span className={cambio >= 0 ? 'is-up' : 'is-down'}>
        <Flecha sube={cambio >= 0} />
        {cambio >= 0 ? '+' : '−'}
        {porcentaje(Math.abs(cambio))}
      </span>{' '}
      vs. {contraQue(d)}
    </>
  );
};

/* "↗ +3 vs. 2025": en conteos pequeños el porcentaje engaña —de 1 a 2 es
   +100%—, asi que se da la diferencia. */
const diferencia = (d: FinanceDashboard, actual: number, anterior: number) => {
  const delta = actual - anterior;
  if (delta === 0) return `Igual que en ${contraQue(d)} (${entero(anterior)})`;
  return (
    <>
      <span className={delta > 0 ? 'is-up' : 'is-down'}>
        <Flecha sube={delta > 0} />
        {delta > 0 ? '+' : '−'}
        {entero(Math.abs(delta))}
      </span>{' '}
      vs. {contraQue(d)} ({entero(anterior)})
    </>
  );
};

/* "↘ −5,1 pp vs. plan": la distancia entre dos porcentajes se dice en
   puntos, no en porcentaje, que se leeria como una variacion relativa. */
const contraPlan = (real: number | null, plan: number) => {
  if (real === null || plan <= 0) return undefined;
  const delta = Math.round((real - plan) * 10) / 10;
  return (
    <>
      <span className={delta >= 0 ? 'is-up' : 'is-down'}>
        <Flecha sube={delta >= 0} />
        {delta >= 0 ? '+' : '−'}
        {decimal(Math.abs(delta))} pp
      </span>{' '}
      vs. plan ({porcentaje(plan)})
    </>
  );
};

/* Las series mes a mes de un tablero. Un mes que todavia no llega no tiene
   cifra real: la serie se corta, en vez de caer a cero y parecer un
   desplome. */
const seriesDe = (d: FinanceDashboard) => {
  const actual = mesActual();
  const real = (f: (m: DashboardMonth) => number | null) =>
    d.months.map((m) => (m.month <= actual ? f(m) : null));
  const plan = (f: (p: NonNullable<DashboardMonth['plan']>) => number) =>
    d.months.map((m) => (m.plan ? f(m.plan) : null));
  const conPlan = d.months.some((m) => m.plan !== null);
  return { meses: d.months.map((m) => m.month), real, plan, conPlan };
};

const acumular = (valores: (number | null)[]) => {
  let suma = 0;
  return valores.map((v) => (v === null ? null : (suma += v)));
};

const meta = (
  key: string,
  label: string,
  values: (number | null)[],
  extra: Partial<TrendSeries> = {},
): TrendSeries => ({ key, label, kind: 'line', tone: 'ink', dashed: true, values, ...extra });

/* ===== Desempeño financiero =====

   Lo del periodo en el lenguaje de un estado de resultados —ventas netas,
   margen bruto, margen de contribucion y resultado— y debajo su evolucion:
   en pesos contra la meta de ventas, o los margenes en porcentaje contra el
   presupuesto. */
const PerformanceBlock = () => {
  const [vista, setVista] = useState<'pesos' | 'margenes'>('pesos');
  return (
    <AnalysisBlock
      title='Desempeño financiero'
      description='Resultados reales frente al presupuesto.'
    >
      {(d) => {
        const { meses, real, plan, conPlan } = seriesDe(d);
        const avance = d.totals.planSales > 0 ? (d.totals.sales / d.totals.planSales) * 100 : null;
        const tasa = (f: (m: DashboardMonth) => number) =>
          real((m) => (m.sales > 0 ? (f(m) / m.sales) * 100 : null));

        const enPesos: TrendSeries[] = [
          { key: 'ventas', label: 'Ventas netas', kind: 'bar', tone: 1, values: real((m) => m.sales) },
          { key: 'resultado', label: 'Resultado estimado', kind: 'bar', tone: 4, values: real((m) => m.result) },
          ...(conPlan ? [meta('meta-ventas', 'Meta de ventas', plan((p) => p.sales))] : []),
          ...(conPlan
            ? [meta('meta-resultado', 'Meta de resultado', plan((p) => p.result), { tone: 4, hidden: true })]
            : []),
          { key: 'bruto', label: 'Margen bruto', kind: 'line', tone: 3, hidden: true, values: real((m) => m.grossMargin) },
          {
            key: 'contribucion',
            label: 'Margen de contribución',
            kind: 'line',
            tone: 2,
            hidden: true,
            values: real((m) => m.contribution),
          },
        ];
        const enMargenes: TrendSeries[] = [
          { key: 'bruto', label: 'Margen bruto', kind: 'line', tone: 3, values: tasa((m) => m.grossMargin) },
          {
            key: 'contribucion',
            label: 'Margen de contribución',
            kind: 'line',
            tone: 2,
            values: tasa((m) => m.contribution),
          },
          {
            key: 'plan-bruto',
            label: 'Presupuesto de margen bruto',
            kind: 'reference',
            tone: 3,
            values: [d.rates.planGrossMargin],
          },
          {
            key: 'plan-contribucion',
            label: 'Presupuesto de contribución',
            kind: 'reference',
            tone: 2,
            values: [d.rates.planContribution],
          },
        ];

        return (
          <>
            <div className='kpi-grid is-row'>
              <Kpi
                label='Ventas netas'
                value={pesosCortos(d.totals.sales)}
                meta={variacion(d, d.totals.sales, d.previous.sales)}
                note={
                  d.totals.planSales > 0
                    ? `Meta ${pesosCortos(d.totals.planSales)} · ${porcentaje(avance ?? 0)} logrado`
                    : 'Meta del período pendiente'
                }
              />
              <Kpi
                label='Margen bruto'
                value={d.rates.grossMargin === null ? '—' : porcentaje(d.rates.grossMargin)}
                meta={contraPlan(d.rates.grossMargin, d.rates.planGrossMargin)}
                note={`${pesosCortos(d.totals.grossMargin)} en el período`}
              />
              <Kpi
                label='Margen de contribución'
                value={d.rates.contribution === null ? '—' : porcentaje(d.rates.contribution)}
                meta={contraPlan(d.rates.contribution, d.rates.planContribution)}
                note={`${pesosCortos(d.totals.contribution)} en el período`}
              />
              <Kpi
                label='Resultado estimado'
                value={pesosCortos(d.totals.result)}
                meta={variacion(d, d.totals.result, d.previous.result)}
                note={`Después de ${pesosCortos(d.totals.fixedCosts)} de gasto fijo`}
              />
            </div>

            <div className='analysis-chart'>
              <ChartViews
                title={vista === 'pesos' ? 'Ventas y resultado por mes' : 'Márgenes por mes'}
                views={[
                  { key: 'pesos', label: 'En pesos' },
                  { key: 'margenes', label: 'Márgenes %' },
                ]}
                value={vista}
                onChange={setVista}
              />
              {vista === 'pesos' ? (
                <TrendChart
                  key='pesos'
                  label='Ventas y resultado'
                  months={meses}
                  series={enPesos}
                  format={pesos}
                  axisFormat={pesosCortos}
                />
              ) : (
                <TrendChart
                  key='margenes'
                  label='Márgenes'
                  months={meses}
                  series={enMargenes}
                  format={porcentaje}
                />
              )}
            </div>
          </>
        );
      }}
    </AnalysisBlock>
  );
};

/* ===== Crecimiento: compradores =====

   Los compradores nuevos de cada mes contra la meta del plan —lo que pidio
   la revision—, los activos, y en la vista acumulada como crece la base. */
const BuyersGrowthBlock = () => {
  const [vista, setVista] = useState<'month' | 'cumulative'>('month');
  return (
    <AnalysisBlock
      as='section'
      title='Compradores nuevos y activos'
      description='Las instituciones que compran por primera vez y las que vuelven, contra la meta del plan.'
    >
      {(d) => {
        const { meses, real, plan, conPlan } = seriesDe(d);
        const series: TrendSeries[] =
          vista === 'month'
            ? [
                { key: 'nuevos', label: 'Nuevos', kind: 'bar', tone: 1, values: real((m) => m.newBuyers) },
                { key: 'activos', label: 'Activos', kind: 'bar', tone: 3, values: real((m) => m.activeBuyers) },
                ...(conPlan ? [meta('meta-nuevos', 'Meta de nuevos', plan((p) => p.newBuyers))] : []),
                ...(conPlan
                  ? [
                      meta('meta-activos', 'Meta de activos', plan((p) => p.activeBuyers), {
                        tone: 3,
                        hidden: true,
                      }),
                    ]
                  : []),
                ...(d.breakEven.activeBuyers > 0
                  ? [
                      {
                        key: 'equilibrio',
                        label: 'Activos para el equilibrio',
                        kind: 'reference',
                        tone: 4,
                        hidden: true,
                        values: [d.breakEven.activeBuyers],
                      } satisfies TrendSeries,
                    ]
                  : []),
              ]
            : [
                {
                  key: 'base',
                  label: 'Base de compradores',
                  kind: 'line',
                  tone: 1,
                  values: d.months.map((m) => m.cumulativeBuyers),
                },
                {
                  key: 'nuevos-acum',
                  label: 'Nuevos en el período',
                  kind: 'bar',
                  tone: 3,
                  values: acumular(real((m) => m.newBuyers)),
                },
                ...(conPlan
                  ? [meta('meta-acum', 'Meta de nuevos', acumular(d.months.map((m) => m.plan?.newBuyers ?? 0)))]
                  : []),
              ];

        return (
          <>
            <div className='kpi-grid is-row'>
              <Kpi
                label='Compradores nuevos'
                value={entero(d.totals.newBuyers)}
                meta={diferencia(d, d.totals.newBuyers, d.previous.newBuyers)}
                note={
                  d.totals.planNewBuyers > 0
                    ? `Meta del plan: ${entero(d.totals.planNewBuyers)} · ${porcentaje((d.totals.newBuyers / d.totals.planNewBuyers) * 100)} logrado`
                    : 'Instituciones con su primera compra'
                }
              />
              <Kpi
                label='Compradores activos'
                value={entero(d.totals.activeBuyers)}
                meta={diferencia(d, d.totals.activeBuyers, d.previous.activeBuyers)}
                note='Compraron al menos una vez en el período'
              />
              <Kpi
                label='Base de compradores'
                value={entero(d.totals.cumulativeBuyers)}
                note='Han comprado alguna vez, al cierre del período'
              />
            </div>
            <div className='analysis-chart'>
              <ChartViews
                title={vista === 'month' ? 'Compradores por mes' : 'Crecimiento de la base'}
                views={[
                  { key: 'month', label: 'Por mes' },
                  { key: 'cumulative', label: 'Acumulado' },
                ]}
                value={vista}
                onChange={setVista}
              />
              <TrendChart key={vista} label='Compradores' months={meses} series={series} format={entero} />
            </div>
          </>
        );
      }}
    </AnalysisBlock>
  );
};

/* ===== Sostenibilidad: punto de equilibrio =====

   Las ventas de cada mes contra lo que hace falta vender para cubrir el gasto
   fijo. Prendiendo el margen de contribucion y el gasto fijo se ve donde se
   cruzan, que es el mismo punto dicho en otras palabras. */
const BreakEvenBlock = () => (
  <AnalysisBlock
    as='section'
    title='Ventas y punto de equilibrio'
    description='Bajo la línea de equilibrio el mes no cubre lo que cuesta operar.'
  >
    {(d) => {
      const { meses, real, plan, conPlan } = seriesDe(d);
      const cobertura = d.totals.fixedCosts > 0 ? (d.totals.contribution / d.totals.fixedCosts) * 100 : null;
      const avance =
        d.breakEven.monthlySales > 0 ? (d.breakEven.lastMonthSales / d.breakEven.monthlySales) * 100 : null;
      const series: TrendSeries[] = [
        { key: 'ventas', label: 'Ventas netas', kind: 'bar', tone: 1, values: real((m) => m.sales) },
        ...(conPlan ? [meta('meta-ventas', 'Meta de ventas', plan((p) => p.sales))] : []),
        {
          key: 'equilibrio',
          label: 'Punto de equilibrio',
          kind: 'reference',
          tone: 4,
          values: [d.breakEven.monthlySales],
        },
        {
          key: 'contribucion',
          label: 'Margen de contribución',
          kind: 'line',
          tone: 3,
          hidden: true,
          values: real((m) => m.contribution),
        },
        { key: 'gasto-fijo', label: 'Gasto fijo', kind: 'line', tone: 2, hidden: true, values: real((m) => m.fixedCosts) },
      ];

      return (
        <>
          <div className='kpi-grid is-row'>
            <Kpi
              label='Punto de equilibrio'
              value={`${pesosCortos(d.breakEven.monthlySales)} / mes`}
              note={`Ventas mensuales necesarias · ${plural(d.breakEven.activeBuyers, 'comprador activo estimado', 'compradores activos estimados')}`}
            />
            <Kpi
              label='Cobertura del gasto fijo'
              value={cobertura === null ? '—' : porcentaje(cobertura)}
              note={
                cobertura === null
                  ? 'Sin gasto fijo en el período'
                  : `${pesosCortos(d.totals.contribution)} de contribución para ${pesosCortos(d.totals.fixedCosts)} de gasto fijo · 100% es el equilibrio`
              }
            />
            <Kpi
              label='Avance al equilibrio'
              value={avance === null ? '—' : porcentaje(avance)}
              note={`Último mes con ventas: ${pesosCortos(d.breakEven.lastMonthSales)} de ${pesosCortos(d.breakEven.monthlySales)}`}
            />
          </div>
          <div className='analysis-chart'>
            <ChartViews title='Ventas frente al equilibrio' />
            <TrendChart label='Ventas' months={meses} series={series} format={pesos} axisFormat={pesosCortos} />
          </div>
        </>
      );
    }}
  </AnalysisBlock>
);

/* ===== Comportamiento del comprador =====

   Lo que el plan supone de cada institucion: cuanto compra por pedido y
   cuantas veces al mes. Las dos se pueden ver mes a mes; la conversion de
   cotizaciones y la recompra solo existen para el periodo entero. */
const BuyerBehaviorBlock = () => {
  const [vista, setVista] = useState<'ticket' | 'frecuencia' | 'pedidos'>('ticket');
  return (
    <AnalysisBlock
      title='Comportamiento del comprador'
      description='El ticket, la frecuencia, la conversión de cotizaciones y la recompra, contra lo que el plan supone.'
    >
      {(d) => {
        const { meses, real } = seriesDe(d);
        const series: Record<typeof vista, TrendSeries[]> = {
          ticket: [
            {
              key: 'ticket',
              label: 'Ticket promedio',
              kind: 'bar',
              tone: 1,
              values: real((m) => (m.orders > 0 ? m.sales / m.orders : null)),
            },
            { key: 'meta', label: 'Meta del plan', kind: 'reference', tone: 'ink', values: [d.buyers.targetTicket] },
          ],
          frecuencia: [
            {
              key: 'frecuencia',
              label: 'Pedidos por comprador',
              kind: 'line',
              tone: 3,
              values: real((m) => (m.activeBuyers > 0 ? m.orders / m.activeBuyers : null)),
            },
            { key: 'meta', label: 'Meta del plan', kind: 'reference', tone: 'ink', values: [d.buyers.targetFrequency] },
          ],
          pedidos: [
            { key: 'pedidos', label: 'Pedidos', kind: 'bar', tone: 1, values: real((m) => m.orders) },
            { key: 'activos', label: 'Compradores activos', kind: 'bar', tone: 3, values: real((m) => m.activeBuyers) },
          ],
        };
        const formato = vista === 'ticket' ? pesos : vista === 'frecuencia' ? decimal : entero;

        return (
          <>
            <div className='kpi-grid is-row'>
              <Kpi
                label='Ticket promedio'
                value={d.buyers.avgTicket === null ? '—' : pesosCortos(d.buyers.avgTicket)}
                note={`Meta ${pesosCortos(d.buyers.targetTicket)} por pedido`}
              />
              <Kpi
                label='Pedidos por comprador al mes'
                value={d.buyers.frequency === null ? '—' : decimal(d.buyers.frequency)}
                note={`Meta ${decimal(d.buyers.targetFrequency)}`}
              />
              <Kpi
                label='Cotizaciones convertidas'
                value={d.quotes.conversion === null ? '—' : porcentaje(d.quotes.conversion)}
                note={`Meta ${porcentaje(d.quotes.target)} · ${d.quotes.converted} de ${d.quotes.created}`}
              />
              <Kpi
                label='Recompra a 60 días'
                value={d.buyers.repurchase60.rate === null ? '—' : porcentaje(d.buyers.repurchase60.rate)}
                note={
                  d.buyers.repurchase60.eligible > 0
                    ? `De ${plural(d.buyers.repurchase60.eligible, 'institución', 'instituciones')} con su primera compra hace 60 días o más`
                    : 'Todavía nadie lleva 60 días desde su primera compra'
                }
              />
              <Kpi
                label='Pedidos del período'
                value={entero(d.totals.orders)}
                meta={diferencia(d, d.totals.orders, d.previous.orders)}
              />
            </div>
            <div className='analysis-chart'>
              <ChartViews
                title={
                  vista === 'ticket'
                    ? 'Ticket promedio por mes'
                    : vista === 'frecuencia'
                      ? 'Pedidos por comprador activo'
                      : 'Pedidos y compradores activos'
                }
                views={[
                  { key: 'ticket', label: 'Ticket' },
                  { key: 'frecuencia', label: 'Frecuencia' },
                  { key: 'pedidos', label: 'Pedidos' },
                ]}
                value={vista}
                onChange={setVista}
              />
              <TrendChart
                key={vista}
                label='Comportamiento del comprador'
                months={meses}
                series={series[vista]}
                format={formato}
                axisFormat={vista === 'ticket' ? pesosCortos : formato}
              />
            </div>
          </>
        );
      }}
    </AnalysisBlock>
  );
};

/* ===== Lineas comerciales =====

   De cada $100 vendidos cuantos vinieron de cada linea, y cuanto margen dejo
   cada una contra el que deberia dejar su incremento. */
const LinesBlock = () => (
  <AnalysisBlock
    title='Líneas comerciales'
    description='El peso de cada línea en las ventas contra el plan, y el margen que deja contra el que espera su incremento.'
  >
    {(d) => (
      <div className='analysis-columns'>
        <div>
          <ChartViews title='Peso en las ventas' />
          <TargetBars
            rows={d.lines.map((l) => ({
              id: l.line,
              label: l.label,
              detail: `${pesos(l.sales)} vendidos`,
              value: l.mix ?? 0,
              target: l.planMix,
            }))}
            format={porcentaje}
            max={100}
            targetLabel='Plan'
          />
        </div>
        <div>
          <ChartViews title='Margen sobre la venta' />
          <TargetBars
            rows={d.lines.map((l) => ({
              id: l.line,
              label: l.label,
              detail: `Incremento ${porcentaje(l.markupRate)} · rango ${porcentaje(l.minRate)}–${porcentaje(l.maxRate)}`,
              value: l.sales > 0 ? (l.grossMargin / l.sales) * 100 : 0,
              target: (l.markupRate / (100 + l.markupRate)) * 100,
            }))}
            format={porcentaje}
            max={30}
            targetLabel='Esperado'
          />
        </div>
      </div>
    )}
  </AnalysisBlock>
);

/* ===== Credito =====

   El estado de hoy, no de un periodo: por eso no lleva filtro sino la marca
   "Hoy". La barra reparte el tope entre lo que esta al dia, lo vencido y lo
   que queda libre; debajo, quien tiene mas cartera contra su cupo. La caja
   no se ve: la app no ve el banco, y el piso de caja se recuerda. */
const CreditPanel = ({ summary }: { summary: FinanceSummary }) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const tablero = useGetFinanceDashboardQuery(presetRange(DEFAULT_RANGE), { skip: !hydrated });
  const cartera = useGetCreditPortfolioQuery(undefined, { skip: !hydrated });
  const d = tablero.data?.data;
  if (!d) return null;

  const { outstanding, overdue, cap } = d.credit;
  const alDia = Math.max(outstanding - overdue, 0);
  const libre = Math.max(cap - outstanding, 0);
  const escala = Math.max(cap, outstanding, 1);
  const uso = cap > 0 ? (outstanding / cap) * 100 : null;
  const mayores = [...(cartera.data?.data ?? [])]
    .filter((r) => r.credit.used > 0)
    .sort((a, b) => b.credit.used - a.credit.used)
    .slice(0, 6);

  const tramos = [
    { key: 'al-dia', label: 'Al día', value: alDia, className: 'tone-1' },
    { key: 'vencido', label: 'Vencido', value: overdue, className: 'tone-2' },
    { key: 'libre', label: 'Disponible del tope', value: libre, className: 'is-free' },
  ];

  return (
    <Panel
      title='Crédito'
      description={`La cartera a crédito contra su tope. Si la caja baja de ${pesos(d.cashFloor)}, el plan suspende el crédito nuevo.`}
      aside={<span className='status-pill'>Hoy</span>}
    >
      <div className='kpi-grid is-row'>
        <Kpi
          label='Cartera por cobrar'
          value={pesosCortos(outstanding)}
          note={plural(summary.pending.credit.buyers, 'comprador con crédito', 'compradores con crédito')}
        />
        <Kpi
          label='Vencido'
          value={pesosCortos(overdue)}
          note={
            overdue > 0
              ? `${plural(summary.pending.credit.overdueOrders, 'pago vencido', 'pagos vencidos')} · ${porcentaje((overdue / Math.max(outstanding, 1)) * 100)} de la cartera`
              : 'Nada vencido'
          }
        />
        <Kpi
          label='Uso del tope'
          value={uso === null ? '—' : porcentaje(uso)}
          note={`Tope de cartera: ${pesosCortos(cap)}`}
        />
      </div>

      <div className='analysis-chart'>
        <ChartViews title='Cartera contra el tope' />
        <div className='credit-gauge' role='img' aria-label={tramos.map((t) => `${t.label} ${pesos(t.value)}`).join(', ')}>
          {tramos.map((t) =>
            t.value > 0 ? (
              <span
                key={t.key}
                className={`credit-gauge-part ${t.className}`}
                style={{ width: `${(t.value / escala) * 100}%` }}
              />
            ) : null,
          )}
        </div>
        <ul className='credit-gauge-legend'>
          {tramos.map((t) => (
            <li key={t.key}>
              <i className={`credit-gauge-dot ${t.className}`} />
              <span className='font-light'>{t.label}</span>
              <b>{pesos(t.value)}</b>
            </li>
          ))}
        </ul>
      </div>

      <div className='analysis-chart'>
        <ChartViews title='Mayores saldos contra su cupo' />
        <TargetBars
          rows={mayores.map((r) => ({
            id: r.organizationId,
            label: r.name,
            detail:
              r.credit.overdue > 0
                ? `${pesos(r.credit.overdue)} vencidos`
                : `Cupo ${r.credit.limit === null ? 'sin definir' : pesos(r.credit.limit)}`,
            value: r.credit.used,
            target: r.credit.limit,
          }))}
          format={pesosCortos}
          targetLabel='Cupo'
          empty='Ningún comprador tiene saldo a crédito.'
        />
        <p className='analysis-note font-light'>
          <Link href='/admin/finance/credit'>Ver toda la cartera</Link>
        </p>
      </div>
    </Panel>
  );
};

/* ===== Movimiento de dinero =====

   Lo que entro al banco, lo que gano Suminia y lo que salio a los
   proveedores, mes a mes. Con IVA: es lo que pasa por la cuenta. Arriba el
   mes en curso y lo que esta en transito; la tabla de meses anteriores es la
   de "Ver los datos" de la grafica. */
const MoneyFlowPanel = ({ summary }: { summary: FinanceSummary }) => {
  const { month, pending, history } = summary;
  /* El historial trae treinta y seis meses: los años que caben en el. */
  const { range, control } = useRangeControl('last12', history[history.length - 1]?.month);
  const actual = mesActual();
  const meses = mesesEntre(range.from, range.to);
  const porMes = new Map(history.map((h) => [h.month, h]));
  const valor = (f: (h: FinanceSummary['history'][number]) => number) =>
    meses.map((m) => (m > actual ? null : f(porMes.get(m) ?? { month: m, collected: 0, commission: 0, paidOut: 0 })));

  const series: TrendSeries[] = [
    { key: 'recaudado', label: 'Recaudado', kind: 'bar', tone: 1, values: valor((h) => h.collected) },
    { key: 'margen', label: 'Margen de Suminia', kind: 'bar', tone: 3, values: valor((h) => h.commission) },
    { key: 'liquidado', label: 'Liquidado a proveedores', kind: 'bar', tone: 2, values: valor((h) => h.paidOut) },
  ];

  return (
    <Panel
      title='Movimiento de dinero'
      description='Recaudado es lo verificado en el banco; el margen, el de lo entregado en el mes; liquidado, lo transferido a los proveedores. Con IVA.'
      aside={control}
    >
      <div className='kpi-grid is-row'>
        <Kpi label={`Recaudado en ${monthName(month.month).toLowerCase()}`} value={pesosCortos(month.collected)} />
        <Kpi label='Margen de Suminia del mes' value={pesosCortos(month.commission)} />
        <Kpi label='Liquidado a proveedores del mes' value={pesosCortos(month.paidOut)} />
        <Kpi
          label='Esperando pago'
          value={pesosCortos(pending.awaitingPayment.amount)}
          note={plural(pending.awaitingPayment.count, 'pedido', 'pedidos')}
        />
        <Kpi
          label='Por liquidar'
          value={pesosCortos(pending.readyToPayout.amount)}
          note={plural(pending.readyToPayout.suppliers, 'proveedor', 'proveedores')}
        />
      </div>

      <div className='analysis-chart'>
        <ChartViews title='Movimiento por mes' />
        <TrendChart label='Movimiento de dinero' months={meses} series={series} format={pesos} axisFormat={pesosCortos} />
        <p className='analysis-note font-light'>{`Mes a mes · ${rangoLargo(range)}.`}</p>
      </div>
    </Panel>
  );
};

const PendingPanel = ({ summary }: { summary: FinanceSummary }) => {
  const { pending, nextPayoutDate } = summary;
  const pendientes = [
    pending.toVerify.count > 0 && {
      texto: `${plural(pending.toVerify.count, 'comprobante', 'comprobantes')} por verificar (${pesos(pending.toVerify.amount)}).`,
      href: '/admin/finance/payments',
    },
    pending.openClaims > 0 && {
      texto: `${plural(pending.openClaims, 'reclamo abierto', 'reclamos abiertos')}: el pedido no se cierra ni se liquida hasta resolverlo.`,
      href: '/admin/finance/claims',
    },
    pending.toInvoiceBuyers > 0 && {
      texto: `${plural(pending.toInvoiceBuyers, 'pedido', 'pedidos')} por facturar.`,
      href: '/admin/finance/to-invoice',
    },
    pending.refunds.count > 0 && {
      texto: `${plural(pending.refunds.count, 'pedido pagado se cayó', 'pedidos pagados se cayeron')}: hay que devolver ${pesos(pending.refunds.amount)}.`,
      href: '/admin/finance/refunds',
    },
    pending.readyToPayout.count > 0 && {
      texto: `${pesos(pending.readyToPayout.amount)} listos para liquidar a ${plural(pending.readyToPayout.suppliers, 'proveedor', 'proveedores')}.`,
      href: '/admin/finance/payouts',
    },
    pending.payoutsUnpaid.count > 0 && {
      texto: `${plural(pending.payoutsUnpaid.count, 'liquidación generada', 'liquidaciones generadas')} sin pagar (${pesos(pending.payoutsUnpaid.amount)}).`,
      href: '/admin/finance/payouts',
    },
    pending.credit.overdueOrders > 0 && {
      texto: `${plural(pending.credit.overdueOrders, 'pago a crédito vencido', 'pagos a crédito vencidos')} por ${pesos(pending.credit.overdue)}.`,
      href: '/admin/finance/credit',
    },
    pending.missingInvoices > 0 && {
      texto: `${plural(pending.missingInvoices, 'factura electrónica pendiente', 'facturas electrónicas pendientes')} por recibir.`,
      href: '/admin/finance/invoices',
    },
  ].filter((p): p is { texto: string; href: string } => Boolean(p));

  return (
    <Panel title='Pendiente' description={`Próxima liquidación: ${formatDay(nextPayoutDate)}.`}>
      {pendientes.length > 0 ? (
        <ul className='summary-todo'>
          {pendientes.map((pendiente) => (
            <li key={pendiente.texto}>
              <AlertTriangle size={17} />
              <span>{pendiente.texto}</span>
              <Link href={pendiente.href}>Revisar</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className='summary-ready'>
          <Check size={17} />
          No hay pagos, devoluciones ni liquidaciones pendientes.
        </p>
      )}
    </Panel>
  );
};

export default FinanceSummaryScreen;

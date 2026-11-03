'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, Check } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';
import { MonthlyBars, PageHeader, PageSkeleton, Panel, TargetBars } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetFinanceDashboardQuery, useGetFinanceSummaryQuery } from '../../api/financeApi';
import { monthName, pesos, pesosCortos, porcentaje } from '../../lib/format';
import type { FinanceDashboard, FinanceSummary } from '../../model/finance.types';

/* El tablero de finanzas: lo que espera a alguien, y el plan financiero
   contra lo real.

   Lo pendiente va primero y cada linea lleva a su bandeja: un comprobante sin
   verificar frena un despacho. Despues el año, con las cifras del informe
   2027-2029 —ventas, margen, aporte, resultado, equilibrio, compradores— cada
   una al lado de su meta, y las graficas mes a mes con la meta marcada.

   Todo antes de IVA. El aporte y el resultado son estimaciones con los
   supuestos de la configuracion (costos variables, gasto fijo): anticipan la
   contabilidad, no la reemplazan. */
export const FinanceSummaryScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [year, setYear] = useState<number | undefined>(undefined);
  const resumen = useGetFinanceSummaryQuery(undefined, { skip: !hydrated });
  const tablero = useGetFinanceDashboardQuery(year, { skip: !hydrated });

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

  const d = tablero.data.data;

  return (
    <>
      <PageHeader
        title='Resumen financiero'
        description='Lo que espera a alguien, y el plan financiero contra lo real. Cifras antes de IVA.'
      />

      <PendingPanel summary={resumen.data.data} />

      <div className={tablero.isFetching ? 'is-refreshing' : undefined}>
        <YearPanel d={d} onYear={setYear} />

        <Panel
          title='Ventas por mes'
          description={`La meta del plan en cada mes, y la venta de equilibrio: ${pesos(d.breakEven.monthlySales)} al mes cubren el gasto fijo.`}
        >
          <MonthlyBars
            label='Ventas'
            data={d.months.map((m) => ({ month: m.month, value: m.sales, target: m.plan?.sales ?? null }))}
            format={pesos}
            shortFormat={pesosCortos}
            targetLabel='Meta del plan'
            reference={{ value: d.breakEven.monthlySales, label: 'Equilibrio' }}
          />
        </Panel>

        <div className='insight-columns'>
          <Panel
            title='Compradores activos'
            description='Instituciones que compraron en el mes.'
          >
            <MonthlyBars
              label='Activos'
              data={d.months.map((m) => ({
                month: m.month,
                value: m.activeBuyers,
                target: m.plan?.activeBuyers ?? null,
              }))}
              format={(v) => String(v)}
              targetLabel='Meta del plan'
              reference={
                d.breakEven.activeBuyers > 0
                  ? { value: d.breakEven.activeBuyers, label: 'Equilibrio' }
                  : undefined
              }
            />
          </Panel>
          <Panel title='Compradores nuevos' description='Instituciones con su primera compra en el mes.'>
            <MonthlyBars
              label='Nuevos'
              data={d.months.map((m) => ({
                month: m.month,
                value: m.newBuyers,
                target: m.plan?.newBuyers ?? null,
              }))}
              format={(v) => String(v)}
              targetLabel='Meta del plan'
            />
          </Panel>
        </div>

        <Panel
          title='Resultado estimado por mes'
          description={`El aporte —margen menos ${porcentaje(d.rates.variableCosts)} de costos variables— menos el gasto fijo de ${pesos(d.fixedCosts)}. Bajo la línea, el mes todavía no cubre lo que cuesta operar.`}
        >
          <MonthlyBars
            label='Resultado'
            data={d.months.map((m) => ({ month: m.month, value: m.result, target: m.plan?.result ?? null }))}
            format={pesos}
            shortFormat={pesosCortos}
            targetLabel='Meta del plan'
          />
        </Panel>

        <div className='insight-columns'>
          <Panel
            title='Mezcla de ventas por línea'
            description='Qué parte de lo vendido es de cada línea, contra la mezcla del plan.'
          >
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
          </Panel>
          <Panel
            title='Margen por línea'
            description='El margen sobre la venta de cada línea, contra el que deja su incremento.'
          >
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
          </Panel>
        </div>

        <BuyersPanel d={d} />
        <CreditPanel d={d} />
      </div>

      <MonthPanel summary={resumen.data.data} />
    </>
  );
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/* La cifra y su meta, en una tarjeta. */
const Kpi = ({ label, value, meta }: { label: string; value: string; meta?: string }) => (
  <div className='kpi-tile'>
    <span className='kpi-label font-light'>{label}</span>
    <span className='kpi-value'>{value}</span>
    {meta && <span className='kpi-change font-light'>{meta}</span>}
  </div>
);

const YearPanel = ({ d, onYear }: { d: FinanceDashboard; onYear: (y: number) => void }) => {
  const avance = d.totals.planSales > 0 ? (d.totals.sales / d.totals.planSales) * 100 : null;
  return (
    <Panel
      title={`El año ${d.year}`}
      description='Lo real del año contra el plan financiero.'
      aside={
        d.years.length > 1 && (
          <select
            className='form-control plan-year'
            aria-label='Año'
            value={d.year}
            onChange={(event) => onYear(Number(event.target.value))}
          >
            {d.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )
      }
    >
      <div className='kpi-grid'>
        <Kpi
          label='Ventas'
          value={pesosCortos(d.totals.sales)}
          meta={
            d.totals.planSales > 0
              ? `Plan ${pesosCortos(d.totals.planSales)} · ${porcentaje(avance ?? 0)} logrado`
              : 'Sin meta para este año'
          }
        />
        <Kpi
          label='Margen bruto'
          value={d.rates.grossMargin === null ? '—' : porcentaje(d.rates.grossMargin)}
          meta={`Plan ${porcentaje(d.rates.planGrossMargin)} · ${pesosCortos(d.totals.grossMargin)}`}
        />
        <Kpi
          label='Aporte'
          value={d.rates.contribution === null ? '—' : porcentaje(d.rates.contribution)}
          meta={`Plan ${porcentaje(d.rates.planContribution)} · ${pesosCortos(d.totals.contribution)}`}
        />
        <Kpi
          label='Resultado estimado'
          value={pesosCortos(d.totals.result)}
          meta={d.totals.planSales > 0 ? `Plan ${pesosCortos(d.totals.planResult)}` : undefined}
        />
        <Kpi
          label='Compradores nuevos'
          value={String(d.totals.newBuyers)}
          meta={d.totals.planNewBuyers > 0 ? `Plan ${d.totals.planNewBuyers}` : undefined}
        />
        <Kpi
          label='Venta de equilibrio'
          value={`${pesosCortos(d.breakEven.monthlySales)} / mes`}
          meta={`${plural(d.breakEven.activeBuyers, 'comprador activo', 'compradores activos')} con el ticket y la frecuencia meta`}
        />
      </div>
    </Panel>
  );
};

/* Como compra la institucion: lo que el informe pide medir para saber si la
   recompra sostiene el plan. */
const BuyersPanel = ({ d }: { d: FinanceDashboard }) => (
  <Panel
    title='Comportamiento del comprador'
    description='El ticket, la frecuencia, la conversión de cotizaciones y la recompra, contra lo que el plan supone.'
  >
    <div className='kpi-grid'>
      <Kpi
        label='Ticket promedio'
        value={d.buyers.avgTicket === null ? '—' : pesosCortos(d.buyers.avgTicket)}
        meta={`Meta ${pesosCortos(d.buyers.targetTicket)} por pedido`}
      />
      <Kpi
        label='Pedidos por comprador al mes'
        value={d.buyers.frequency === null ? '—' : d.buyers.frequency.toFixed(1).replace('.', ',')}
        meta={`Meta ${String(d.buyers.targetFrequency).replace('.', ',')}`}
      />
      <Kpi
        label='Cotizaciones convertidas'
        value={d.quotes.conversion === null ? '—' : porcentaje(d.quotes.conversion)}
        meta={`Meta ${porcentaje(d.quotes.target)} · ${d.quotes.converted} de ${d.quotes.created}`}
      />
      <Kpi
        label='Recompra a 60 días'
        value={d.buyers.repurchase60.rate === null ? '—' : porcentaje(d.buyers.repurchase60.rate)}
        meta={
          d.buyers.repurchase60.eligible > 0
            ? `De ${plural(d.buyers.repurchase60.eligible, 'institución', 'instituciones')} con su primera compra hace 60 días o más`
            : 'Todavía nadie lleva 60 días desde su primera compra'
        }
      />
      <Kpi label='Pedidos del año' value={String(d.totals.orders)} />
    </div>
  </Panel>
);

/* El credito contra su tope. La caja no: la app no ve el banco, y el piso
   de caja se recuerda para que se mire junto a esto. */
const CreditPanel = ({ d }: { d: FinanceDashboard }) => (
  <Panel
    title='Crédito'
    description={`La cartera a crédito contra su tope. Si la caja baja de ${pesos(d.cashFloor)}, el plan suspende el crédito nuevo.`}
  >
    <TargetBars
      rows={[
        {
          id: 'cartera',
          label: 'Cartera por cobrar',
          detail: d.credit.overdue > 0 ? `${pesos(d.credit.overdue)} vencidos` : 'Nada vencido',
          value: d.credit.outstanding,
          target: d.credit.cap,
        },
      ]}
      format={pesos}
      max={Math.max(d.credit.cap, d.credit.outstanding, 1)}
      targetLabel='Tope'
    />
  </Panel>
);

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
      texto: `${plural(pending.toInvoiceBuyers, 'pedido cobrado', 'pedidos cobrados')} sin la factura de Suminia al comprador.`,
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
      texto: `${plural(pending.missingInvoices, 'pedido despachado', 'pedidos despachados')} sin la factura del proveedor a Suminia: no se le puede liquidar.`,
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

/* El dinero que se movio en el mes: lo que entro al banco, lo que gano
   Suminia y lo que salio a los proveedores. Con IVA: es lo que pasa por la
   cuenta. */
const MonthPanel = ({ summary }: { summary: FinanceSummary }) => {
  const { month, pending, history } = summary;
  return (
    <>
      <Panel
        title={`Movimiento de ${monthName(month.month).toLowerCase()}`}
        description='Recaudado es lo verificado en el banco; el margen, el de lo entregado este mes; liquidado, lo transferido a los proveedores.'
      >
        <ul className='data-list'>
          <li>
            <span className='font-light'>Recaudado</span>
            <span>{pesos(month.collected)}</span>
          </li>
          <li>
            <span className='font-light'>Margen de Suminia</span>
            <span>{pesos(month.commission)}</span>
          </li>
          <li>
            <span className='font-light'>Liquidado a proveedores</span>
            <span>{pesos(month.paidOut)}</span>
          </li>
          <li>
            <span className='font-light'>Esperando pago</span>
            <span>
              {pesos(pending.awaitingPayment.amount)} ·{' '}
              {plural(pending.awaitingPayment.count, 'pedido', 'pedidos')}
            </span>
          </li>
          <li>
            <span className='font-light'>Por liquidar</span>
            <span>{pesos(pending.readyToPayout.amount)}</span>
          </li>
        </ul>
      </Panel>

      <Panel title='Meses anteriores'>
        <div className='catalog-table-scroll'>
          <table className='catalog-table'>
            <thead>
              <tr>
                <th>Mes</th>
                <th className='num'>Recaudado</th>
                <th className='num'>Margen</th>
                <th className='num'>Liquidado</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(1).map((item) => (
                <tr key={item.month}>
                  <td>{monthName(item.month)}</td>
                  <td className='num'>{pesos(item.collected)}</td>
                  <td className='num'>{pesos(item.commission)}</td>
                  <td className='num'>{pesos(item.paidOut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
};

export default FinanceSummaryScreen;

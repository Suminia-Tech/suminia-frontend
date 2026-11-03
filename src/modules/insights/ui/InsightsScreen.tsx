'use client';

import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { MonthlyBars, PageHeader, PageSkeleton, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetInsightsQuery } from '../api/insightsApi';
import type { Comparison } from '../model/insights.types';
import { mesLargo, pesos, pesosCortos, porcentaje } from './format';
import RankList from './RankList';

/* Los indicadores comerciales: lo que le sirve a quien vende Suminia.

   Arriba lo del mes contra el anterior —ventas, pedidos, ticket, comision,
   compradores y proveedores activos—, que es lo primero que se pregunta en
   una reunion. Despues la tendencia de doce meses, una medida por grafica.
   Abajo quien compra, quien vende y que se mueve en el periodo elegido, y la
   salud de la operacion: cuanto se cae, cuanto se repite, cuanto tarda.

   El periodo afecta a los rankings; las tendencias son siempre doce meses. */

const PERIODOS = [3, 6, 12] as const;

const TIPO_CLIENTE: Record<string, string> = {
  IPS: 'IPS',
  CLINICAL_LABORATORY: 'Laboratorio clínico',
  DIAGNOSTIC_CENTER: 'Centro de diagnóstico',
  PHARMACY: 'Droguería',
  NON_PROFIT: 'Entidad sin ánimo de lucro',
  NON_HEALTH_ENTITY: 'Entidad fuera del sector salud',
  PRIVATE_COMPANY: 'Empresa privada',
  INDEPENDENT_PROFESSIONAL: 'Profesional independiente',
  OTHER: 'Otro tipo',
  SIN: 'Sin definir',
};

const numero = (valor: number) => valor.toLocaleString('es-CO');
const decimal = (valor: number) =>
  valor.toLocaleString('es-CO', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const plural = (n: number, uno: string, varios: string) => `${numero(n)} ${n === 1 ? uno : varios}`;

/* La cifra del mes y su cambio frente al anterior. Sin mes anterior no hay
   porcentaje que dar: se dice, en vez de inventar un "+100%". */
const Kpi = ({
  label,
  value,
  format,
}: {
  label: string;
  value: Comparison;
  format: (valor: number) => string;
}) => {
  /* Sin movimiento el mes anterior no hay porcentaje que dar: se dice, en
     vez de inventar un "+100%". */
  const cambio = value.previous > 0 ? (value.current - value.previous) / value.previous : null;
  return (
    <div className='kpi-tile'>
      <span className='kpi-label font-light'>{label}</span>
      <strong className='kpi-value'>{format(value.current)}</strong>
      <span className='kpi-change font-light'>
        {cambio === null ? (
          value.current === 0 ? 'Sin movimiento este mes ni el anterior' : 'El mes anterior no tuvo movimiento'
        ) : (
          <>
            <span className={cambio >= 0 ? 'is-up' : 'is-down'}>
              {cambio >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {porcentaje(Math.abs(cambio))}
            </span>{' '}
            vs. mes anterior ({format(value.previous)})
          </>
        )}
      </span>
    </div>
  );
};

export const InsightsScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [months, setMonths] = useState<(typeof PERIODOS)[number]>(12);
  const { data, isLoading, isError, error, isFetching } = useGetInsightsQuery(months, {
    skip: !hydrated,
  });

  if (!hydrated || isLoading) return <PageSkeleton variant='dashboard' />;
  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudieron cargar los indicadores.')}
      </div>
    );
  }

  const insights = data.data;
  const { kpis } = insights;
  const mesActual = insights.months[insights.months.length - 1]?.month;
  const periodo = months === 12 ? 'los últimos 12 meses' : `los últimos ${months} meses`;

  return (
    <div className={isFetching ? 'is-refreshing' : undefined}>
      <PageHeader
        title='Indicadores'
        description='Cómo va el negocio: ventas, clientes, proveedores y productos. Ventas es el valor de los pedidos que siguen en pie, con IVA y envío.'
      />

      <Panel
        title={mesActual ? mesLargo(mesActual) : 'Este mes'}
        description='El mes en curso frente al anterior.'
      >
        <div className='kpi-grid'>
          <Kpi label='Ventas' value={kpis.sales} format={pesos} />
          <Kpi label='Pedidos' value={kpis.orders} format={numero} />
          <Kpi label='Ticket promedio' value={kpis.averageTicket} format={pesos} />
          <Kpi label='Margen de Suminia' value={kpis.commission} format={pesos} />
          <Kpi label='Compradores que compraron' value={kpis.activeBuyers} format={numero} />
          <Kpi label='Proveedores que vendieron' value={kpis.activeSuppliers} format={numero} />
        </div>
      </Panel>

      <div className='insight-columns'>
        <Panel title='Ventas por mes' description='Los últimos 12 meses.'>
          <MonthlyBars
            label='Ventas'
            data={insights.months.map((m) => ({ month: m.month, value: m.sales }))}
            format={pesos}
            shortFormat={pesosCortos}
          />
        </Panel>
        <Panel title='Pedidos por mes' description='Los últimos 12 meses.'>
          <MonthlyBars
            label='Pedidos'
            data={insights.months.map((m) => ({ month: m.month, value: m.orders }))}
            format={numero}
          />
        </Panel>
        <Panel title='Margen por mes' description='Lo que gana Suminia: lo vendido menos lo comprado, antes de IVA.'>
          <MonthlyBars
            label='Margen'
            data={insights.months.map((m) => ({ month: m.month, value: m.commission }))}
            format={pesos}
            shortFormat={pesosCortos}
          />
        </Panel>
        <Panel title='Compradores nuevos por mes' description='Los que hicieron su primer pedido.'>
          <MonthlyBars
            label='Compradores nuevos'
            data={insights.months.map((m) => ({ month: m.month, value: m.newBuyers }))}
            format={numero}
          />
        </Panel>
      </div>

      <div className='orders-filter insight-period'>
        <span className='font-light'>Rankings de</span>
        {PERIODOS.map((p) => (
          <button
            type='button'
            key={p}
            className={months === p ? 'is-chosen' : undefined}
            onClick={() => setMonths(p)}
          >
            {p} meses
          </button>
        ))}
      </div>

      <div className='insight-columns'>
        <Panel title='Mejores compradores' description={`Por ventas en ${periodo}.`}>
          <RankList rows={insights.topBuyers} empty='Todavía no hay compras en este periodo.' />
        </Panel>
        <Panel title='Mejores proveedores' description={`Por ventas en ${periodo}.`}>
          <RankList rows={insights.topSuppliers} empty='Todavía no hay ventas en este periodo.' />
        </Panel>
        <Panel title='Productos más vendidos' description={`Por ventas en ${periodo}.`}>
          <RankList
            rows={insights.topProducts}
            empty='Todavía no hay ventas en este periodo.'
            detail={(row) =>
              `${plural(row.units ?? 0, 'unidad', 'unidades')} · ${plural(row.orders, 'pedido', 'pedidos')}`
            }
          />
        </Panel>
        <Panel title='Ventas por categoría' description={`En ${periodo}.`}>
          <RankList rows={insights.categories} empty='Todavía no hay ventas en este periodo.' />
        </Panel>
        <Panel title='Ventas por ciudad de entrega' description={`En ${periodo}.`}>
          <RankList rows={insights.cities} empty='Todavía no hay ventas en este periodo.' />
        </Panel>
        <Panel title='Ventas por tipo de cliente' description={`En ${periodo}.`}>
          <RankList
            rows={insights.buyerTypes.map((row) => ({
              ...row,
              name: TIPO_CLIENTE[row.name] ?? row.name,
            }))}
            empty='Todavía no hay ventas en este periodo.'
          />
        </Panel>
      </div>

      <div className='insight-columns'>
        <Panel title='Salud de la operación' description='De los últimos 90 días.'>
          <ul className='data-list is-single'>
            <li>
              <span className='font-light'>Pedidos que se cayeron</span>
              <span>{porcentaje(kpis.cancellationRate)} (cancelados o rechazados)</span>
            </li>
            <li>
              <span className='font-light'>Compradores que repiten</span>
              <span>{porcentaje(kpis.repeatRate)} hicieron más de un pedido</span>
            </li>
            <li>
              <span className='font-light'>Cotizaciones convertidas</span>
              <span>
                {kpis.quoteConversion === null
                  ? 'Sin cotizaciones'
                  : `${porcentaje(kpis.quoteConversion)} terminaron en pedido`}
              </span>
            </li>
            <li>
              <span className='font-light'>Verificar un pago</span>
              <span>
                {kpis.paymentVerificationHours === null
                  ? 'Sin pagos verificados'
                  : kpis.paymentVerificationHours < 1
                    ? 'Menos de una hora en promedio'
                    : `${decimal(kpis.paymentVerificationHours)} horas en promedio`}
              </span>
            </li>
            <li>
              <span className='font-light'>Del pedido a la entrega</span>
              <span>
                {kpis.deliveryDays === null
                  ? 'Sin entregas'
                  : `${decimal(kpis.deliveryDays)} días en promedio`}
              </span>
            </li>
          </ul>
        </Panel>
        <Panel title='Empresas' description='Aprobadas y esperando revisión.'>
          <ul className='data-list is-single'>
            <li>
              <span className='font-light'>Compradores</span>
              <span>
                {insights.companies.buyers.active} aprobados · {insights.companies.buyers.pending}{' '}
                por revisar
              </span>
            </li>
            <li>
              <span className='font-light'>Proveedores</span>
              <span>
                {insights.companies.suppliers.active} aprobados ·{' '}
                {insights.companies.suppliers.pending} por revisar
              </span>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
};

export default InsightsScreen;

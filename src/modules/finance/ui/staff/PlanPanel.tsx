'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { Panel, SkeletonRows } from '@/shared/ui';

import { useGetPlanQuery, useSavePlanMonthMutation } from '../../api/financeApi';
import { monthName, pesos } from '../../lib/format';
import type { PlanMonth } from '../../model/finance.types';

/* Las metas de cada mes del plan financiero: compradores nuevos y activos,
   ventas y resultado. El tablero compara lo real contra esto. Vienen
   cargadas con el escenario base del informe y se ajustan cuando cambie el
   plan; un mes sin meta simplemente no se compara. */
export const PlanPanel = ({ editable }: { editable: boolean }) => {
  const { data, isLoading } = useGetPlanQuery();
  const plan = data?.data ?? [];
  const actual = new Date().getFullYear();
  const years = [...new Set([actual, actual + 1, ...plan.map((p) => Number(p.month.slice(0, 4)))])].sort();
  /* Por defecto el año en curso si tiene metas; si no, el siguiente que
     las tenga: el plan arranca en 2027. */
  const [elegido, setYear] = useState<number | null>(null);
  const year =
    elegido ??
    (plan.some((p) => p.month.startsWith(String(actual)))
      ? actual
      : (years.find((y) => y > actual && plan.some((p) => p.month.startsWith(String(y)))) ??
        actual));
  const porMes = new Map(plan.map((p) => [p.month, p]));
  const meses = Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
  const total = meses.reduce((s, m) => s + (porMes.get(m)?.sales ?? 0), 0);

  return (
    <Panel
      title='Metas del plan'
      description={`Lo que el plan espera cada mes, antes de IVA. Ventas del año: ${pesos(total)}.`}
      aside={
        <select
          className='form-control plan-year'
          aria-label='Año del plan'
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      }
    >
      {isLoading ? (
        <SkeletonRows rows={6} />
      ) : (
        <div className='catalog-table-scroll'>
          <table className='catalog-table plan-table'>
            <thead>
              <tr>
                <th>Mes</th>
                <th className='num'>Nuevos</th>
                <th className='num'>Activos</th>
                <th className='num'>Ventas</th>
                <th className='num'>Resultado</th>
                {editable && <th />}
              </tr>
            </thead>
            <tbody>
              {meses.map((mes) => {
                const meta = porMes.get(mes);
                return (
                  <PlanRow
                    key={`${mes}-${meta?.sales}-${meta?.result}-${meta?.newBuyers}-${meta?.activeBuyers}`}
                    month={mes}
                    meta={meta}
                    editable={editable}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
};

type Campo = 'newBuyers' | 'activeBuyers' | 'sales' | 'result';

const PlanRow = ({
  month,
  meta,
  editable,
}: {
  month: string;
  meta: PlanMonth | undefined;
  editable: boolean;
}) => {
  const [save, { isLoading }] = useSavePlanMonthMutation();
  const inicial = (c: Campo) => (meta ? String(meta[c]) : '');
  const [campos, setCampos] = useState<Record<Campo, string>>({
    newBuyers: inicial('newBuyers'),
    activeBuyers: inicial('activeBuyers'),
    sales: inicial('sales'),
    result: inicial('result'),
  });
  const cambiado = (Object.keys(campos) as Campo[]).some((c) => campos[c] !== inicial(c));
  const completo = (Object.keys(campos) as Campo[]).every((c) => campos[c] !== '');

  const guardar = async () => {
    try {
      await save({
        month,
        newBuyers: Number(campos.newBuyers),
        activeBuyers: Number(campos.activeBuyers),
        sales: Number(campos.sales),
        result: Number(campos.result),
      }).unwrap();
      toast.success(`Meta de ${monthName(month).toLowerCase()} guardada`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar.'));
    }
  };

  const input = (campo: Campo, etiqueta: string, dinero = false) => (
    <input
      type='number'
      className={`form-control plan-input${dinero ? ' is-money' : ''}`}
      aria-label={`${etiqueta} · ${monthName(month)}`}
      step={dinero ? 100000 : 1}
      min={campo === 'result' ? undefined : 0}
      disabled={!editable}
      value={campos[campo]}
      onChange={(event) => setCampos((actual) => ({ ...actual, [campo]: event.target.value }))}
    />
  );

  return (
    <tr>
      <td className='is-nowrap'>{monthName(month)}</td>
      <td className='num'>{input('newBuyers', 'Compradores nuevos')}</td>
      <td className='num'>{input('activeBuyers', 'Compradores activos')}</td>
      <td className='num'>{input('sales', 'Ventas', true)}</td>
      <td className='num'>{input('result', 'Resultado', true)}</td>
      {editable && (
        <td className='num'>
          <button
            type='button'
            className='btn btn-primary btn-sm'
            disabled={!cambiado || !completo || isLoading}
            onClick={guardar}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </td>
      )}
    </tr>
  );
};

export default PlanPanel;

'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { mesLargo } from '@/shared/lib/months';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetFinanceDashboardQuery } from '../../api/financeApi';

import {
  DEFAULT_RANGE,
  fechaDeCorte,
  MAX_RANGE_MONTHS,
  mesActual,
  mesesEntre,
  moverMes,
  rangeOptions,
  rangoLargo,
} from '../../lib/period';
import type { FinanceDashboard, MonthRange } from '../../model/finance.types';

const CUSTOM = 'custom';

/* Un mes de una lista, en un desplegable propio y no en un <select>: el
   nativo de macOS abre la lista de modo que la opcion elegida quede sobre el
   control, y con el ultimo mes elegido la lista salia hacia arriba. Este
   siempre abre hacia abajo, en orden cronologico, con el mes elegido a la
   vista. Se cierra al elegir, con Escape o al hacer clic fuera. */
const MonthSelect = ({
  label,
  months,
  value,
  onChange,
}: {
  label: string;
  months: string[];
  value: string;
  onChange: (month: string) => void;
}) => {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!abierto) return;
    lista.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: 'center' });
    const fuera = (event: MouseEvent) => {
      if (!caja.current?.contains(event.target as Node)) setAbierto(false);
    };
    const tecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  return (
    <div className='month-select' ref={caja}>
      <button
        type='button'
        className='month-select-button'
        aria-label={`${label}: ${mesLargo(value)}`}
        aria-haspopup='listbox'
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
      >
        {mesLargo(value)}
        <ChevronDown size={14} />
      </button>
      {abierto && (
        <ul className='month-select-list' role='listbox' aria-label={label} ref={lista}>
          {months.map((m) => (
            <li key={m} role='option' aria-selected={m === value}>
              <button
                type='button'
                className={m === value ? 'is-chosen' : undefined}
                onClick={() => {
                  onChange(m);
                  setAbierto(false);
                }}
              >
                {mesLargo(m)}
                {m === value && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* El periodo de una grafica: un desplegable en su encabezado, como en
   cualquier tablero de analisis. Cada grafica lleva el suyo, para poder ver
   las ventas del año junto a los compradores del ultimo trimestre.

   Los atajos cubren casi todo; "Personalizado…" abre al lado dos meses,
   desde y hasta, con el mismo aspecto del desplegable. Al mover un extremo
   el otro se corre si el rango quedaria al reves o pasaria del tope. */
export const useRangeControl = (defaultKey: string, primerMes?: string) => {
  const [clave, setClave] = useState(defaultKey);
  const opciones = rangeOptions(primerMes);
  const atajo = opciones.find((o) => o.key === clave) ?? opciones[0];
  const [aMano, setAMano] = useState<MonthRange>(atajo.range);
  const range = clave === CUSTOM ? aMano : atajo.range;

  /* Los meses elegibles: desde el primero con datos hasta diciembre de este
     año, y los del rango aunque queden fuera, para no perder el valor. */
  const anio = mesActual().slice(0, 4);
  const inicio = [primerMes ?? `${anio}-01`, range.from].sort()[0];
  const fin = [`${anio}-12`, range.to].sort()[1];
  const meses = mesesEntre(inicio, fin);

  const elegir = (key: string) => {
    if (key === CUSTOM) setAMano(range);
    setClave(key);
  };
  const cambiarDesde = (from: string) => {
    let to = aMano.to < from ? from : aMano.to;
    if (mesesEntre(from, to).length > MAX_RANGE_MONTHS) to = moverMes(from, MAX_RANGE_MONTHS - 1);
    setAMano({ from, to });
  };
  const cambiarHasta = (to: string) => {
    let from = aMano.from > to ? to : aMano.from;
    if (mesesEntre(from, to).length > MAX_RANGE_MONTHS) from = moverMes(to, -(MAX_RANGE_MONTHS - 1));
    setAMano({ from, to });
  };

  const control = (
    <div className='range-control'>
      <select
        className='filter-select range-select'
        aria-label='Período de la gráfica'
        value={clave === CUSTOM ? CUSTOM : atajo.key}
        onChange={(event) => elegir(event.target.value)}
      >
        {opciones.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
        <option value={CUSTOM}>Personalizado…</option>
      </select>
      {clave === CUSTOM && (
        <div className='range-custom'>
          <MonthSelect label='Desde' months={meses} value={aMano.from} onChange={cambiarDesde} />
          <span className='font-light'>a</span>
          <MonthSelect label='Hasta' months={meses} value={aMano.to} onChange={cambiarHasta} />
        </div>
      )}
    </div>
  );

  return { range, control };
};

interface AnalysisBlockProps {
  title: string;
  description: string;
  /** Un panel propio, o un bloque dentro de uno. */
  as?: 'panel' | 'section';
  children: (d: FinanceDashboard) => ReactNode;
}

/* Un analisis del tablero con su propio periodo: pide el tablero del rango
   que se elija en su encabezado y le pasa las cifras a su contenido. Dos
   bloques con el mismo rango comparten la respuesta: RTK Query no la pide
   dos veces.

   Al pie dice hasta que dia van las cifras y contra que se comparan: sin eso
   un "+12%" no dice nada. */
export const AnalysisBlock = ({ title, description, as = 'panel', children }: AnalysisBlockProps) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  /* Los años y meses que se pueden elegir salen del propio tablero —desde el
     primer mes con datos—, de la respuesta que ya este en la mano. */
  const [desde, setDesde] = useState<string | undefined>(undefined);
  const { range, control: selector } = useRangeControl(DEFAULT_RANGE, desde);
  const { data, isLoading, isFetching, isError, error } = useGetFinanceDashboardQuery(range, {
    skip: !hydrated,
  });
  const d = data?.data;
  const primerMes = d?.bounds?.from;
  if (primerMes && primerMes !== desde) setDesde(primerMes);

  let cuerpo: ReactNode;
  if (!hydrated || isLoading) {
    cuerpo = <div className='analysis-loading' aria-busy='true' />;
  } else if (isError || !d?.range) {
    cuerpo = (
      <div className='alert alert-danger mb-0'>
        {extractErrorMessage(error, 'No se pudieron cargar estas cifras.')}
      </div>
    );
  } else {
    cuerpo = (
      <div className={isFetching ? 'is-refreshing' : undefined}>
        {children(d)}
        <p className='analysis-note font-light'>
          {d.asOf
            ? `Información acumulada al ${fechaDeCorte(d.asOf)} · ${rangoLargo(d.range)}. `
            : `El período todavía no empieza: solo hay metas del plan. `}
          Las variaciones se comparan con{' '}
          {d.comparison === 'year'
            ? `los mismos meses del año anterior (${rangoLargo(d.previousRange)}).`
            : `el período anterior del mismo largo (${rangoLargo(d.previousRange)}).`}
        </p>
      </div>
    );
  }

  if (as === 'section') {
    return (
      <section className='panel-subsection'>
        <header>
          <div>
            <h4>{title}</h4>
            <p className='font-light'>{description}</p>
          </div>
          {selector}
        </header>
        {cuerpo}
      </section>
    );
  }
  return (
    <Panel title={title} description={description} aside={selector}>
      {cuerpo}
    </Panel>
  );
};

/* Las vistas de una misma grafica —pesos o porcentajes, por mes o
   acumulado—: la barra de pastillas de los filtros, en pequeño. */
export const ChartViews = <T extends string>({
  title,
  views = [],
  value,
  onChange,
}: {
  title: string;
  views?: { key: T; label: string }[];
  value?: T;
  onChange?: (key: T) => void;
}) => (
  <div className='analysis-toolbar'>
    <h5>{title}</h5>
    {views.length > 1 && onChange && (
      <div className='orders-filter' role='group' aria-label={`Vista de ${title.toLowerCase()}`}>
        {views.map((view) => (
          <button
            type='button'
            key={view.key}
            className={value === view.key ? 'is-chosen' : undefined}
            onClick={() => onChange(view.key)}
          >
            {view.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

'use client';

import { useState } from 'react';
import { Check } from 'react-feather';

import { mesCorto, mesLargo } from '@/shared/lib/months';

/* Varias series por mes en una misma grafica, para el analisis: barras y
   lineas sobre un solo eje, con su escala a la izquierda, y cada serie se
   prende o se apaga desde la leyenda.

   Un solo eje a proposito: todas las series de una grafica comparten unidad
   —pesos con pesos, compradores con compradores—. Dos escalas en el mismo
   dibujo hacen que una de las dos mienta; si la unidad cambia, otra grafica.

   - Las barras de varias series se agrupan dentro del mes.
   - Una linea con tono `ink` y discontinua es una meta del plan: la misma
     tinta oscura que la marca de meta de las barras por mes.
   - Una referencia es una linea a lo ancho, como el equilibrio, y tambien se
     prende y se apaga.
   - Un valor nulo es un mes que todavia no llega: la linea se corta ahi en vez
     de caer a cero.

   Al pasar el cursor por un mes salen todas las series visibles; debajo, la
   tabla con los mismos datos. Con mas de doce meses el eje muestra uno de
   cada dos o tres, y enero lleva el año. */

export type TrendTone = 1 | 2 | 3 | 4 | 'ink';

export interface TrendSeries {
  key: string;
  label: string;
  kind: 'bar' | 'line' | 'reference';
  /** Un valor por mes; en una referencia, el primero es la linea. */
  values: (number | null)[];
  tone: TrendTone;
  dashed?: boolean;
  /** Apagada al abrir: se prende desde la leyenda. */
  hidden?: boolean;
}

interface TrendChartProps {
  label: string;
  months: string[];
  series: TrendSeries[];
  format: (value: number) => string;
  /** Para el eje, donde la cifra entera no cabe. */
  axisFormat?: (value: number) => string;
}

const ALTO = 240;
const MARGEN = { top: 14, bottom: 30 };

/* Divisiones redondas para el eje: 1, 2, 2,5 o 5 por una potencia de diez,
   para que se lean "$ 20 M, $ 40 M" y no "$ 17,3 M". */
const pasoRedondo = (rango: number, divisiones: number) => {
  const bruto = rango / divisiones;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const base = bruto / potencia;
  const redondo = base <= 1 ? 1 : base <= 2 ? 2 : base <= 2.5 ? 2.5 : base <= 5 ? 5 : 10;
  return redondo * potencia;
};

const escalaDe = (valores: number[]) => {
  const maxBruto = Math.max(...valores, 0);
  const minBruto = Math.min(...valores, 0);
  if (maxBruto === minBruto) return { min: 0, max: 1, ticks: [0, 1] };
  const paso = pasoRedondo(maxBruto - minBruto, 4);
  const min = Math.floor(minBruto / paso) * paso;
  const max = Math.ceil(maxBruto / paso) * paso;
  const ticks: number[] = [];
  for (let t = min; t <= max + paso / 2; t += paso) ticks.push(Math.round(t * 1e6) / 1e6);
  return { min, max, ticks };
};

export const TrendChart = ({
  label,
  months,
  series,
  format,
  axisFormat = format,
}: TrendChartProps) => {
  const [apagadas, setApagadas] = useState<Set<string>>(
    () => new Set(series.filter((s) => s.hidden).map((s) => s.key)),
  );
  const [activo, setActivo] = useState<number | null>(null);

  const visibles = series.filter((s) => !apagadas.has(s.key));
  const barras = visibles.filter((s) => s.kind === 'bar');
  const lineas = visibles.filter((s) => s.kind === 'line');
  const referencias = visibles.filter((s) => s.kind === 'reference');

  const valores = visibles.flatMap((s) =>
    (s.kind === 'reference' ? s.values.slice(0, 1) : s.values).filter(
      (v): v is number => v !== null,
    ),
  );
  const { min, max, ticks } = escalaDe(valores);
  const rango = max - min || 1;
  const altoUtil = ALTO - MARGEN.top - MARGEN.bottom;
  const y = (valor: number) => MARGEN.top + altoUtil * ((max - valor) / rango);
  const pct = (px: number) => `${(px / ALTO) * 100}%`;
  const cero = y(0);
  const ancho = 100 / Math.max(months.length, 1);
  const cada = Math.ceil(months.length / 12);

  const alternar = (key: string) =>
    setApagadas((actual) => {
      const nuevo = new Set(actual);
      if (nuevo.has(key)) nuevo.delete(key);
      else nuevo.add(key);
      return nuevo;
    });

  /* Una linea con meses nulos son varios tramos: no se une a traves de ellos. */
  const tramos = (values: (number | null)[]) => {
    const lista: string[][] = [];
    let actual: string[] = [];
    values.forEach((v, i) => {
      if (v === null) {
        if (actual.length) lista.push(actual);
        actual = [];
        return;
      }
      actual.push(`${(i + 0.5) * ancho},${y(v)}`);
    });
    if (actual.length) lista.push(actual);
    return lista;
  };

  const etiquetaMes = (month: string, i: number) => {
    if (i % cada !== 0) return null;
    const corto = mesCorto(month);
    return month.endsWith('-01') || (i === 0 && months.length > 12)
      ? `${corto} ${month.slice(2, 4)}`
      : corto;
  };

  return (
    <figure className='trend-chart'>
      <div className='trend-legend' role='group' aria-label='Series de la gráfica'>
        {series.map((s) => {
          const prendida = !apagadas.has(s.key);
          return (
            <button
              type='button'
              key={s.key}
              className={`trend-toggle${prendida ? ' is-on' : ''}`}
              aria-pressed={prendida}
              onClick={() => alternar(s.key)}
            >
              <span className={`trend-swatch is-${s.kind} tone-${s.tone}${s.dashed ? ' is-dashed' : ''}`}>
                {prendida && s.kind === 'bar' && <Check size={10} strokeWidth={3} />}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>

      <div className='trend-body'>
        <div className='trend-axis' aria-hidden='true'>
          {ticks.map((t) => (
            <span key={t} style={{ bottom: pct(ALTO - y(t)) }}>
              {axisFormat(t)}
            </span>
          ))}
        </div>

        <div className='trend-plot' role='img' aria-label={`${label} por mes`}>
          <svg viewBox={`0 0 100 ${ALTO}`} preserveAspectRatio='none' aria-hidden='true'>
            {ticks.map((t) => (
              <line
                key={t}
                x1={0}
                x2={100}
                y1={y(t)}
                y2={y(t)}
                className={t === 0 ? 'insight-axis' : 'insight-grid'}
                vectorEffect='non-scaling-stroke'
              />
            ))}
            {referencias.map((s) =>
              s.values[0] === null || s.values[0] === undefined ? null : (
                <line
                  key={s.key}
                  x1={0}
                  x2={100}
                  y1={y(s.values[0])}
                  y2={y(s.values[0])}
                  className={`trend-reference tone-${s.tone}`}
                  vectorEffect='non-scaling-stroke'
                />
              ),
            )}
            {lineas.map((s) =>
              tramos(s.values).map((puntos, k) => (
                <polyline
                  key={`${s.key}-${k}`}
                  points={puntos.join(' ')}
                  className={`trend-line tone-${s.tone}${s.dashed ? ' is-dashed' : ''}`}
                  vectorEffect='non-scaling-stroke'
                />
              )),
            )}
          </svg>

          {months.map((month, i) => {
            const etiqueta = etiquetaMes(month, i);
            const alDerecho = i < months.length * 0.6;
            return (
              <div
                key={month}
                className={`trend-slot${activo === i ? ' is-active' : ''}`}
                style={{ left: `${i * ancho}%`, width: `${ancho}%` }}
                onMouseEnter={() => setActivo(i)}
                onMouseLeave={() => setActivo(null)}
                onFocus={() => setActivo(i)}
                onBlur={() => setActivo(null)}
                tabIndex={0}
                aria-label={`${mesLargo(month)}: ${visibles
                  .filter((s) => s.kind !== 'reference')
                  .map((s) => `${s.label} ${s.values[i] === null ? 'sin dato' : format(s.values[i]!)}`)
                  .join(', ')}`}
              >
                {barras.map((s, b) => {
                  const v = s.values[i];
                  if (v === null || v === 0) return null;
                  const alto = Math.max((Math.abs(v) / rango) * altoUtil, 2);
                  const base = ALTO - cero - (v < 0 ? alto : 0);
                  const grupo = 64 / barras.length;
                  return (
                    <span
                      key={s.key}
                      className={`trend-bar tone-${s.tone}${v < 0 ? ' is-negative' : ''}`}
                      style={{
                        left: `${18 + b * grupo}%`,
                        width: `${grupo}%`,
                        height: pct(alto),
                        bottom: pct(base),
                      }}
                    />
                  );
                })}
                {lineas.map((s) =>
                  s.values[i] === null ? null : (
                    <span
                      key={s.key}
                      className={`trend-dot tone-${s.tone}`}
                      style={{ bottom: pct(ALTO - y(s.values[i]!)) }}
                    />
                  ),
                )}
                {etiqueta && <span className='trend-month'>{etiqueta}</span>}
                {activo === i && (
                  <span className={`trend-tooltip${alDerecho ? ' is-right' : ' is-left'}`}>
                    <strong>{mesLargo(month)}</strong>
                    {visibles.map((s) => {
                      const v = s.kind === 'reference' ? s.values[0] : s.values[i];
                      return (
                        <span key={s.key}>
                          <i className={`trend-swatch is-${s.kind} tone-${s.tone}${s.dashed ? ' is-dashed' : ''}`} />
                          {s.label}
                          <b>{v === null || v === undefined ? '—' : format(v)}</b>
                        </span>
                      );
                    })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <details className='insight-table'>
        <summary>Ver los datos</summary>
        <div className='catalog-table-scroll'>
          <table className='catalog-table'>
            <thead>
              <tr>
                <th>Mes</th>
                {series
                  .filter((s) => s.kind !== 'reference')
                  .map((s) => (
                    <th key={s.key} className='num'>
                      {s.label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {[...months].reverse().map((month) => {
                const i = months.indexOf(month);
                return (
                  <tr key={month}>
                    <td>{mesLargo(month)}</td>
                    {series
                      .filter((s) => s.kind !== 'reference')
                      .map((s) => (
                        <td key={s.key} className='num'>
                          {s.values[i] === null ? '—' : format(s.values[i]!)}
                        </td>
                      ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
};

export default TrendChart;

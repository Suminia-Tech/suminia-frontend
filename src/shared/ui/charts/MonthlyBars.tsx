'use client';

import { useState } from 'react';

import { mesCorto, mesLargo } from '@/shared/lib/months';

/* Una medida por mes, en barras: una sola serie, un solo eje. Medidas de
   distinta escala van en graficas separadas —con dos escalas en un mismo eje,
   una de las dos miente—.

   Barras finas con la punta redondeada y apoyadas en la base, rejilla
   discreta, etiqueta solo en la barra mayor y en la ultima con valor, y la
   cifra exacta al pasar el cursor. Debajo, la tabla con los mismos datos.

   Opcionales, para comparar contra un plan:
   - target: la meta de cada mes, como una marca horizontal oscura sobre la
     barra. No es otra serie de color: es la vara contra la que se mide.
   - reference: una linea a lo ancho, como el equilibrio.
   Admite negativos —un resultado que todavia no cubre el gasto fijo—: la base
   pasa a ser el cero y la barra baja de el. */

const ALTO = 180;
const MARGEN = { top: 18, right: 8, bottom: 26, left: 8 };

export interface MonthlyBarsDatum {
  month: string;
  value: number;
  target?: number | null;
}

interface MonthlyBarsProps {
  label: string;
  data: MonthlyBarsDatum[];
  format: (value: number) => string;
  /** Para los valores sobre las barras, donde la cifra entera no cabe. */
  shortFormat?: (value: number) => string;
  /** Como se llama la meta en la leyenda y el detalle. */
  targetLabel?: string;
  reference?: { value: number; label: string };
}

export const MonthlyBars = ({
  label,
  data,
  format,
  shortFormat = format,
  targetLabel = 'Meta',
  reference,
}: MonthlyBarsProps) => {
  const [activo, setActivo] = useState<number | null>(null);
  const valores = data.flatMap((d) => [d.value, d.target ?? 0]).concat(reference?.value ?? 0);
  const max = Math.max(...valores, 1);
  const min = Math.min(...valores, 0);
  const rango = max - min || 1;
  const ancho = 100 / data.length;
  const mayor = data.findIndex((d) => d.value === Math.max(...data.map((x) => x.value)));
  const ultimoConValor = data.map((d) => d.value !== 0).lastIndexOf(true);
  const altoUtil = ALTO - MARGEN.top - MARGEN.bottom;
  const conMeta = data.some((d) => d.target !== undefined && d.target !== null);
  /* La altura en el SVG de un valor: el cero no esta en la base si hay
     negativos. */
  const y = (valor: number) => MARGEN.top + altoUtil * ((max - valor) / rango);
  const pct = (px: number) => `${(px / ALTO) * 100}%`;
  const cero = y(0);

  return (
    <figure className='insight-chart'>
      {(conMeta || reference) && (
        <div className='chart-legend' aria-hidden='true'>
          <span>
            <i className='chart-legend-bar' /> {label}
          </span>
          {conMeta && (
            <span>
              <i className='chart-legend-target' /> {targetLabel}
            </span>
          )}
          {reference && (
            <span>
              <i className='chart-legend-reference' /> {reference.label}
            </span>
          )}
        </div>
      )}
      <div className='insight-bars' role='img' aria-label={`${label} por mes`}>
        <svg viewBox={`0 0 100 ${ALTO}`} preserveAspectRatio='none' aria-hidden='true'>
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={0}
              x2={100}
              y1={MARGEN.top + altoUtil * (1 - t)}
              y2={MARGEN.top + altoUtil * (1 - t)}
              className='insight-grid'
              vectorEffect='non-scaling-stroke'
            />
          ))}
          <line
            x1={0}
            x2={100}
            y1={cero}
            y2={cero}
            className='insight-axis'
            vectorEffect='non-scaling-stroke'
          />
          {reference && (
            <line
              x1={0}
              x2={100}
              y1={y(reference.value)}
              y2={y(reference.value)}
              className='chart-reference'
              vectorEffect='non-scaling-stroke'
            />
          )}
        </svg>
        {data.map((d, i) => {
          const alto = d.value !== 0 ? Math.max((Math.abs(d.value) / rango) * altoUtil, 3) : 0;
          const negativo = d.value < 0;
          /* Desde abajo: la base de una barra positiva es el cero; la de una
             negativa, el cero menos su alto. */
          const base = ALTO - cero - (negativo ? alto : 0);
          const etiqueta = (i === mayor || i === ultimoConValor) && d.value !== 0;
          const tieneMeta = d.target !== undefined && d.target !== null;
          return (
            <div
              key={d.month}
              className={`insight-bar-slot${activo === i ? ' is-active' : ''}`}
              style={{ left: `${i * ancho}%`, width: `${ancho}%` }}
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(i)}
              onBlur={() => setActivo(null)}
              tabIndex={0}
              aria-label={`${mesLargo(d.month)}: ${format(d.value)}${tieneMeta ? `, ${targetLabel.toLowerCase()} ${format(d.target!)}` : ''}`}
            >
              <span
                className={`insight-bar${negativo ? ' is-negative' : ''}`}
                style={{ height: pct(alto), bottom: pct(base) }}
              />
              {tieneMeta && (
                <span className='chart-target' style={{ bottom: pct(ALTO - y(d.target!)) }} />
              )}
              {etiqueta && activo !== i && (
                <span
                  className='insight-bar-value'
                  style={{ bottom: pct(negativo ? base - 16 : base + alto + 4) }}
                >
                  {shortFormat(d.value)}
                </span>
              )}
              <span className='insight-bar-month'>{mesCorto(d.month)}</span>
              {activo === i && (
                <span
                  className='insight-tooltip'
                  style={{ bottom: pct(Math.max(base + alto, tieneMeta ? ALTO - y(d.target!) : 0) + 6) }}
                >
                  <strong>{mesLargo(d.month)}</strong>
                  {format(d.value)}
                  {tieneMeta && (
                    <span>
                      {targetLabel}: {format(d.target!)}
                    </span>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <details className='insight-table'>
        <summary>Ver los datos</summary>
        <table className='catalog-table'>
          <thead>
            <tr>
              <th>Mes</th>
              <th className='num'>{label}</th>
              {conMeta && <th className='num'>{targetLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.month}>
                <td>{mesLargo(d.month)}</td>
                <td className='num'>{format(d.value)}</td>
                {conMeta && (
                  <td className='num'>
                    {d.target !== undefined && d.target !== null ? format(d.target) : '—'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
};

export default MonthlyBars;

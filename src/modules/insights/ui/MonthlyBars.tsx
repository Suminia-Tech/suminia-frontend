'use client';

import { useState } from 'react';

import { mesCorto, mesLargo } from './format';

/* Una medida por mes, en barras: una sola serie, un solo eje. Ventas, pedidos
   y compradores nuevos van en graficas separadas —con dos escalas en un mismo
   eje, una de las dos miente—.

   Barras finas con la punta redondeada y apoyadas en la base, rejilla
   discreta, etiqueta solo en la barra mayor y en la del mes en curso, y la
   cifra exacta al pasar el cursor. Debajo, la tabla con los mismos datos. */

const ALTO = 180;
const MARGEN = { top: 18, right: 8, bottom: 26, left: 8 };

interface MonthlyBarsProps {
  label: string;
  data: { month: string; value: number }[];
  format: (value: number) => string;
  /** Para los valores sobre las barras, donde la cifra entera no cabe. */
  shortFormat?: (value: number) => string;
}

export const MonthlyBars = ({ label, data, format, shortFormat = format }: MonthlyBarsProps) => {
  const [activo, setActivo] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const ancho = 100 / data.length;
  const mayor = data.findIndex((d) => d.value === max);
  const ultimo = data.length - 1;
  const altoUtil = ALTO - MARGEN.top - MARGEN.bottom;

  return (
    <figure className='insight-chart'>
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
            y1={ALTO - MARGEN.bottom}
            y2={ALTO - MARGEN.bottom}
            className='insight-axis'
            vectorEffect='non-scaling-stroke'
          />
        </svg>
        {data.map((d, i) => {
          const alto = d.value > 0 ? Math.max((d.value / max) * altoUtil, 3) : 0;
          const etiqueta = (i === mayor || i === ultimo) && d.value > 0;
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
              aria-label={`${mesLargo(d.month)}: ${format(d.value)}`}
            >
              <span
                className='insight-bar'
                style={{ height: `${(alto / ALTO) * 100}%`, bottom: `${(MARGEN.bottom / ALTO) * 100}%` }}
              />
              {etiqueta && activo !== i && (
                <span
                  className='insight-bar-value'
                  style={{ bottom: `${((alto + MARGEN.bottom + 4) / ALTO) * 100}%` }}
                >
                  {shortFormat(d.value)}
                </span>
              )}
              <span className='insight-bar-month'>{mesCorto(d.month)}</span>
              {activo === i && (
                <span
                  className='insight-tooltip'
                  style={{ bottom: `${((alto + MARGEN.bottom + 6) / ALTO) * 100}%` }}
                >
                  <strong>{mesLargo(d.month)}</strong>
                  {format(d.value)}
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
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.month}>
                <td>{mesLargo(d.month)}</td>
                <td className='num'>{format(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
};

export default MonthlyBars;

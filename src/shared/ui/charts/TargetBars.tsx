/* Filas con una barra horizontal y su meta: la mezcla real de cada linea
   contra la del plan, la cartera contra su tope, la conversion contra la
   esperada. Se pintan como el ranking —nombre, cifra y barra en su renglon—
   para que se lean igual, y la meta es la misma marca oscura que en las
   barras por mes.

   Sin escala comun entre filas salvo que se pase `max`: cada fila se mide
   contra el mayor de su valor y su meta, o contra el `max` dado si las filas
   comparten unidad (porcentajes que suman 100). */

export interface TargetBarRow {
  id: string;
  label: string;
  detail?: string;
  value: number;
  target?: number | null;
}

export const TargetBars = ({
  rows,
  format,
  max,
  targetLabel = 'Meta',
  empty,
}: {
  rows: TargetBarRow[];
  format: (value: number) => string;
  /** La escala comun; sin ella, la mayor cifra de todas las filas. */
  max?: number;
  targetLabel?: string;
  empty?: string;
}) => {
  if (rows.length === 0) return empty ? <p className='font-light mb-0'>{empty}</p> : null;
  const escala =
    max ?? Math.max(...rows.flatMap((r) => [r.value, r.target ?? 0]), 1);
  const conMeta = rows.some((r) => r.target !== undefined && r.target !== null);

  return (
    <>
      {conMeta && (
        <div className='chart-legend' aria-hidden='true'>
          <span>
            <i className='chart-legend-bar' /> Real
          </span>
          <span>
            <i className='chart-legend-target' /> {targetLabel}
          </span>
        </div>
      )}
      <ol className='insight-rank'>
        {rows.map((row) => {
          const tieneMeta = row.target !== undefined && row.target !== null;
          return (
            <li
              key={row.id}
              title={`${row.label}: ${format(row.value)}${tieneMeta ? ` · ${targetLabel.toLowerCase()} ${format(row.target!)}` : ''}`}
            >
              <div className='insight-rank-head'>
                <span className='insight-rank-name'>
                  {row.label}
                  {row.detail && <small className='font-light'>{row.detail}</small>}
                </span>
                <strong>
                  {format(row.value)}
                  {tieneMeta && (
                    <small className='font-light'>
                      {' '}
                      / {format(row.target!)}
                    </small>
                  )}
                </strong>
              </div>
              <span className='insight-rank-track chart-target-track'>
                <span
                  className='insight-rank-bar'
                  style={{ width: `${Math.min((row.value / escala) * 100, 100)}%` }}
                />
                {tieneMeta && (
                  <span
                    className='chart-target-tick'
                    style={{ left: `${Math.min((row.target! / escala) * 100, 100)}%` }}
                  />
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default TargetBars;

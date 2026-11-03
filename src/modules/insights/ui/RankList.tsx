import type { RankRow } from '../model/insights.types';
import { pesos } from './format';

/* Un ranking: cada fila con su nombre, una barra proporcional y la cifra. Las
   barras son horizontales porque los nombres son largos —una clinica, un
   producto— y se leen mejor en su renglon que girados bajo un eje. */
export const RankList = ({
  rows,
  empty,
  detail,
}: {
  rows: RankRow[];
  empty: string;
  /** Lo que se dice debajo del nombre: pedidos, unidades. */
  detail?: (row: RankRow) => string;
}) => {
  if (rows.length === 0) return <p className='font-light mb-0'>{empty}</p>;
  const max = Math.max(...rows.map((r) => r.sales), 1);

  return (
    <ol className='insight-rank'>
      {rows.map((row) => (
        <li key={row.id} title={`${row.name}: ${pesos(row.sales)} · ${row.orders} pedidos`}>
          <div className='insight-rank-head'>
            <span className='insight-rank-name'>
              {row.name}
              <small className='font-light'>
                {detail ? detail(row) : `${row.orders} ${row.orders === 1 ? 'pedido' : 'pedidos'}`}
              </small>
            </span>
            <strong>{pesos(row.sales)}</strong>
          </div>
          <span className='insight-rank-track'>
            <span className='insight-rank-bar' style={{ width: `${(row.sales / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ol>
  );
};

export default RankList;

'use client';

import type { PaginationMeta } from '../api/types';

/* Paginacion de los listados. Vive en shared porque el backend pagina igual en
   todos sus endpoints: la misma meta { page, limit, totalCount, totalPages }.

   Muestra una ventana de paginas alrededor de la actual en vez de todas: con
   cuarenta paginas la barra ocuparia mas que la tabla. */

interface PaginationProps {
  meta: PaginationMeta;
  onChange: (page: number) => void;
  /** Nombre de lo que se lista, para el resumen: "42 productos". */
  label?: string;
}

const WINDOW = 2;

const pagesAround = (current: number, total: number): number[] => {
  const from = Math.max(1, current - WINDOW);
  const to = Math.min(total, current + WINDOW);
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
};

const Pagination = ({ meta, onChange, label = 'resultados' }: PaginationProps) => {
  const { page, limit, totalCount, totalPages } = meta;

  /* Con una sola pagina la barra no aporta nada, pero el recuento si: dice
     cuantos hay en total sin obligar a contarlos. */
  const first = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const last = Math.min(page * limit, totalCount);

  return (
    <div className='list-pagination'>
      <span className='font-light'>
        {totalCount === 0
          ? `Sin ${label}`
          : `${first}–${last} de ${totalCount} ${label}`}
      </span>

      {totalPages > 1 && (
        <nav>
          <ul>
            <li>
              <button
                type='button'
                className='btn btn-sm'
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
              >
                Anterior
              </button>
            </li>

            {pagesAround(page, totalPages).map((number) => (
              <li key={number}>
                <button
                  type='button'
                  className={`btn btn-sm${number === page ? ' active' : ''}`}
                  onClick={() => onChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            <li>
              <button
                type='button'
                className='btn btn-sm'
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Pagination;

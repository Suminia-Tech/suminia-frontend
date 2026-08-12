import type { DatatableParams } from '../model/organization.types';

/* Piezas que comparten suppliersApi y buyersApi. El backend expone los dos
   dominios por separado (/suppliers y /buyers) pero con la misma forma de
   listado, de modo que la construccion de la query vive aqui una sola vez. */

const DEFAULT_LIMIT = 10;

/* El filtro viaja aplanado como filter[campo]=valor, que es lo que espera el
   FilterValidationPipe del backend. */
export const toDatatableQuery = (
  params: DatatableParams = {},
): Record<string, string | number> => {
  const { page = 1, limit = DEFAULT_LIMIT, search, sort, sortDirection, filter } = params;

  const query: Record<string, string | number> = { page, limit };

  if (search) query.search = search;
  if (sort) query.sort = sort;
  if (sortDirection) query.sortDirection = sortDirection;

  Object.entries(filter ?? {}).forEach(([field, value]) => {
    if (value) query[`filter[${field}]`] = value;
  });

  return query;
};

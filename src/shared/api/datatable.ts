import type { DatatableParams } from './types';

export const DEFAULT_PAGE_SIZE = 10;

/* El filtro viaja aplanado como filter[campo]=valor, que es lo que espera el
   FilterValidationPipe del backend. Un objeto anidado llega como [object
   Object] y el pipe lo rechaza. */
export const toDatatableQuery = (
  params: DatatableParams = {},
): Record<string, string | number> => {
  const {
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    search,
    sort,
    sortDirection,
    filter,
  } = params;

  const query: Record<string, string | number> = { page, limit };

  if (search) query.search = search;
  if (sort) query.sort = sort;
  if (sortDirection) query.sortDirection = sortDirection;

  Object.entries(filter ?? {}).forEach(([field, value]) => {
    if (value) query[`filter[${field}]`] = value;
  });

  return query;
};

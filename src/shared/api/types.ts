/* Forma de las respuestas del backend, comun a todos los modulos.

   Vive en shared/ y no dentro de un modulo porque la envoltura { data, message }
   y el datatable son del backend entero, no de un dominio: auth, organizations,
   users y products los necesitan por igual, y tenerlos repetidos hacia que cada
   modulo pudiera describir el mismo contrato de forma distinta. */

/** El backend envuelve todo en { data, message }. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Parámetros que aceptan los listados paginados del backend. */
export interface DatatableParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  filter?: Record<string, string>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

/* Los listados llegan doblemente anidados: la envoltura del backend y dentro
   el { data, meta } del datatable. De ahi que leerlos sea result.data.data. */
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

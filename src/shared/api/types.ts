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

/* Permiso firmado para subir un archivo directo al almacenamiento. Los bytes no
   pasan por la API: el backend firma, el navegador sube y la API confirma. */
export interface UploadTicket {
  uploadUrl: string;
  fields: Record<string, string>;
  storageKey: string;
  maxBytes: number;
  expiresIn: number;
}

/* Enlace firmado para abrir un archivo privado. Caduca a los pocos minutos. */
export interface SignedUrl {
  url: string;
  expiresIn: number;
}

/* Los listados llegan doblemente anidados: la envoltura del backend y dentro
   el { data, meta } del datatable. De ahi que leerlos sea result.data.data. */
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

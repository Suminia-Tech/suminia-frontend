/* Contrato con el backend para organizaciones. Proveedores y compradores
   comparten la tabla Organization: lo que hay aqui vale para los dos, y lo
   propio de cada uno vive en supplier.types.ts / buyer.types.ts. */

export type OrganizationType = 'SUPPLIER' | 'BUYER';

export type OrganizationStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  status: OrganizationStatus;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** El backend envuelve todo en { data, message }. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Parámetros del datatable que aceptan los listados del backend. */
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

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

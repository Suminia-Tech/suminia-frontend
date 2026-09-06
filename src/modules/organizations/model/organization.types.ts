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

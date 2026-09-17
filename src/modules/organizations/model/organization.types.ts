/* Contrato con el backend para organizaciones. Proveedores y compradores
   comparten la tabla Organization: lo que hay aqui vale para los dos, y lo
   propio de cada uno vive en supplier.types.ts / buyer.types.ts. */

export type OrganizationType = 'SUPPLIER' | 'BUYER';

export type OrganizationStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

/* Las dos que maneja un banco colombiano para consignar. */
export type BankAccountType = 'AHORROS' | 'CORRIENTE';

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
  /* Lo menos que este proveedor despacha, sumado el pedido. Null en un
     comprador, y null en un proveedor que no exige minimo —que no es cero. */
  minOrderValue: number | null;
  /* A donde Suminia le consigna al proveedor. Null mientras no la registre; en
     un comprador siempre, porque a el no se le paga. */
  bankName: string | null;
  bankAccountType: BankAccountType | null;
  bankAccountNumber: string | null;
  bankAccountHolder: string | null;
  bankAccountHolderTaxId: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

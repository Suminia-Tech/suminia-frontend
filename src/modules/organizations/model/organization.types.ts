/* Contrato con el backend para organizaciones. Proveedores y compradores
   comparten la tabla Organization: lo que hay aqui vale para los dos, y lo
   propio de cada uno vive en supplier.types.ts / buyer.types.ts. */

export type OrganizationType = 'SUPPLIER' | 'BUYER';

export type OrganizationStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

/* Las dos que maneja un banco colombiano para consignar. */
export type BankAccountType = 'AHORROS' | 'CORRIENTE';

/* El perfil comercial del proveedor: que hace en la cadena y que lineas vende.
   No es ProductType, que es lo que cada producto es ante el INVIMA: es como se
   presenta la empresa. */
export type SupplierActivity = 'MANUFACTURER' | 'IMPORTER' | 'DISTRIBUTOR';

export type SupplierProductLine =
  | 'MEDICAL_DEVICES'
  | 'IN_VITRO_DIAGNOSTICS'
  | 'HOSPITAL_SUPPLIES'
  | 'CLEANING_DISINFECTION'
  | 'BIOMEDICAL_EQUIPMENT'
  | 'HOSPITAL_FURNITURE'
  | 'MEDICINES';

/* Una persona por area: a quien llama Suminia cuando algo de esa area se traba.
   Datos internos, los compradores no los ven. */
export type ContactArea =
  | 'COMMERCIAL'
  | 'LOGISTICS'
  | 'BILLING'
  | 'COLLECTIONS'
  | 'MANAGEMENT';

export interface OrganizationContact {
  area: ContactArea;
  name: string;
  position: string | null;
  email: string;
  phone: string | null;
}

/* Los soportes legales con los que Suminia verifica a la empresa. Uno vigente
   por tipo: subir otro reemplaza al anterior. */
export type OrganizationDocumentType =
  | 'CHAMBER_OF_COMMERCE'
  | 'RUT'
  | 'SHAREHOLDING'
  | 'LEGAL_REPRESENTATIVE_ID';

export interface OrganizationDocument {
  id: string;
  type: OrganizationDocumentType;
  filename: string | null;
  uploadedAt: string;
}

/* La declaracion del Sistema de Autocontrol y Gestion de Riesgos LA/FT/FP y
   C/ST (antes SAGRILAFT). Las declaraciones aceptadas no van como booleanos:
   sin aceptarlas no se puede enviar, y lo que queda es cuando se aceptaron. */
export type InternationalOperationType =
  | 'IMPORTS'
  | 'EXPORTS'
  | 'FOREIGN_SUPPLIER_PAYMENTS'
  | 'FOREIGN_CUSTOMER_COLLECTIONS'
  | 'INTERNATIONAL_TRANSFERS'
  | 'OTHER';

export interface SupplierDeclaration {
  fundsOrigin: string;
  isPep: boolean;
  internationalOperations: boolean;
  internationalOperationTypes: InternationalOperationType[];
  otherOperation: string | null;
  operationCountries: string | null;
  currencies: string[];
  marketingConsent: boolean;
  declarationsAcceptedAt: string;
  dataPolicyAcceptedAt: string;
  submittedAt: string;
  updatedAt: string;
}

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
  /* Solo del proveedor. En un comprador las listas vienen vacias, y exporter
     nulo es "no lo ha dicho", que no es lo mismo que "no".

     Opcionales aunque el backend actual siempre los manda: un backend sin la
     migracion no los trae, y una pantalla que asume que estan se cae entera
     por tres datos de perfil. */
  activities?: SupplierActivity[];
  productLines?: SupplierProductLine[];
  exporter?: boolean | null;
  /* A donde llegan las ordenes de compra, los contactos por area y los
     documentos legales. Opcionales por la misma razon que el perfil. */
  orderEmails?: string[];
  contacts?: OrganizationContact[];
  documents?: OrganizationDocument[];
  /* Nula mientras el proveedor no la envie. */
  declaration?: SupplierDeclaration | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

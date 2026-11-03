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
/* Las del proveedor y las del comprador, en un mismo enum como en el
   backend. Gerencia es de los dos. */
export type ContactArea =
  | 'COMMERCIAL'
  | 'LOGISTICS'
  | 'BILLING'
  | 'COLLECTIONS'
  | 'MANAGEMENT'
  | 'PURCHASING_LEAD'
  | 'PURCHASING_ASSISTANT'
  | 'ACCOUNTING'
  | 'TREASURY'
  | 'TECHNICAL_LEAD'
  | 'WAREHOUSE'
  /* Un area que la empresa nombra a su manera; el nombre va en customArea. */
  | 'OTHER';

/* El tiempo de entrega en una ciudad, cuando no es el general. En dias
   habiles: 0 y 0 es el mismo dia, iguales un numero fijo, distintos un rango. */
export interface SupplierDeliveryTime {
  city: string;
  daysMin: number;
  daysMax: number;
}

/* El costo de envio a una ciudad, cuando no es el general. Final, con IVA. */
export interface SupplierShippingCost {
  city: string;
  cost: number;
}

/* Una bodega o punto de inventario del proveedor: por donde sale la
   mercancia y a donde va Suminia en una visita de calidad. */
export interface SupplierWarehouse {
  id: string;
  name: string | null;
  address: string;
  city: string;
}

export interface OrganizationContact {
  area: ContactArea;
  /* Solo en OTHER: como llama la empresa a esa area. */
  customArea?: string | null;
  name: string;
  position: string | null;
  email: string;
  phone: string | null;
}

/* Los soportes legales con los que Suminia verifica a la empresa. Cada subida
   es una version que el personal de Suminia aprueba o rechaza, y las
   anteriores se conservan. */
export type OrganizationDocumentType =
  | 'CHAMBER_OF_COMMERCE'
  | 'RUT'
  | 'SHAREHOLDING'
  | 'LEGAL_REPRESENTATIVE_ID'
  /* Solo del comprador: prueba que la cuenta con la que paga es suya. */
  | 'BANK_CERTIFICATE';

/* Quien es el comprador: decide que documentos se le piden. */
export type LegalNature = 'LEGAL_ENTITY' | 'NATURAL_PERSON';

export type BuyerActivity =
  | 'IPS'
  | 'CLINICAL_LABORATORY'
  | 'DIAGNOSTIC_CENTER'
  | 'PHARMACY'
  | 'NON_PROFIT'
  | 'NON_HEALTH_ENTITY'
  | 'PRIVATE_COMPANY'
  | 'INDEPENDENT_PROFESSIONAL'
  | 'OTHER';

export type IpsSector = 'PUBLIC' | 'MIXED' | 'PRIVATE';

/* El estado de una version. EXPIRED no lo guarda el backend: es una aprobada
   cuya fecha de vencimiento ya paso, y la calcula al responder. REPLACED es
   la que dejo de valer porque se aprobo otra o se subio otra antes de
   revisarla. */
export type OrganizationDocumentStatus =
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REPLACED'
  | 'EXPIRED';

/* Quien subio o reviso una version. */
export interface DocumentActor {
  id: string;
  name: string;
}

/* Una version de un documento. Llegan todas, la mas reciente primero dentro
   de cada tipo. Los campos de la revision son opcionales porque un backend
   anterior no los manda. */
export interface OrganizationDocument {
  id: string;
  type: OrganizationDocumentType;
  filename: string | null;
  status?: OrganizationDocumentStatus;
  uploadedAt: string;
  uploadedBy?: DocumentActor | null;
  reviewedAt?: string | null;
  reviewedBy?: DocumentActor | null;
  rejectionReason?: string | null;
  expiresAt?: string | null;
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
  /* En cuantos dias habiles despacha, como rango. Opcionales: un backend
     anterior no los manda. */
  deliveryDaysMin?: number | null;
  deliveryDaysMax?: number | null;
  /* Por ciudad. Opcional: un backend anterior no la manda. */
  deliveryTimes?: SupplierDeliveryTime[];
  /* El envio: gratis desde un monto sin IVA (null: no ofrece) y su costo si
     no se llega (null: no cobra). Y por ciudad, cuando cuesta distinto. */
  freeShippingFrom?: number | null;
  shippingCost?: number | null;
  shippingCosts?: SupplierShippingCost[];
  /* Las areas propias de la empresa, ademas de las sugeridas. */
  customContactAreas?: string[];
  /* Descuento financiero por pronto pago. Null: no lo ha dicho. */
  offersEarlyPaymentDiscount?: boolean | null;
  earlyPaymentDiscountRate?: number | null;
  earlyPaymentDiscountDays?: number | null;
  /* El plazo neto en dias: cero es de contado, null no lo ha dicho. */
  paymentTermDays?: number | null;
  /* A donde Suminia le consigna al proveedor. Null mientras no la registre; en
     un comprador siempre, porque a el no se le paga. */
  bankName: string | null;
  bankAccountType: BankAccountType | null;
  bankAccountNumber: string | null;
  bankAccountHolder: string | null;
  bankAccountHolderTaxId: string | null;
  /* La llave Bre-B de esa cuenta, opcional. */
  breBKey?: string | null;
  /* Solo del proveedor. En un comprador las listas vienen vacias, y exporter
     nulo es "no lo ha dicho", que no es lo mismo que "no".

     Opcionales aunque el backend actual siempre los manda: un backend sin la
     migracion no los trae, y una pantalla que asume que estan se cae entera
     por tres datos de perfil. */
  activities?: SupplierActivity[];
  productLines?: SupplierProductLine[];
  exporter?: boolean | null;
  /* Si expide factura electronica de venta validada por la DIAN. Null: no ha
     respondido. Sin un si, Suminia no lo aprueba. */
  issuesElectronicInvoices?: boolean | null;
  /* A donde llegan las ordenes de compra, los contactos por area y los
     documentos legales. Opcionales por la misma razon que el perfil. */
  orderEmails?: string[];
  /* El perfil del comprador. Nulos en un proveedor. */
  legalNature?: LegalNature | null;
  buyerActivity?: BuyerActivity | null;
  ipsSector?: IpsSector | null;
  activityOther?: string | null;
  contacts?: OrganizationContact[];
  /* Opcional por la misma razon que el perfil: un backend anterior no la
     manda. */
  warehouses?: SupplierWarehouse[];
  documents?: OrganizationDocument[];
  /* Nula mientras el proveedor no la envie. */
  declaration?: SupplierDeclaration | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

import type {
  BankAccountType,
  Organization,
  OrganizationContact,
  InternationalOperationType,
  OrganizationDocumentType,
  SupplierActivity,
  SupplierProductLine,
} from './organization.types';

/* Un proveedor es una Organization con type = SUPPLIER. El backend lo expone
   como dominio propio en /suppliers, de modo que aqui se le da nombre propio
   aunque hoy comparta forma con Organization: cuando el modulo de proveedores
   sume campos suyos (catalogo, condiciones comerciales), se agregan aqui sin
   tocar el tipo comun. */
export type Supplier = Organization;

/* taxId y legalName no viajan: identifican legalmente a la empresa y el DTO
   del backend corre con forbidNonWhitelisted, de modo que enviarlos da 422. */
export interface UpdateSupplierRequest {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  /* Solo del proveedor: es lo que exige para despachar. null lo quita, y por eso
     se acepta null y no basta con omitirlo. */
  minOrderValue?: number | null;
  /* Los cinco de la cuenta viajan juntos: el backend rechaza media cuenta.
     Nulos en los cinco la quitan. */
  bankName?: string | null;
  bankAccountType?: BankAccountType | null;
  bankAccountNumber?: string | null;
  bankAccountHolder?: string | null;
  bankAccountHolderTaxId?: string | null;
  /* Las listas reemplazan a las anteriores: se manda lo que esta marcado ahora,
     y una vacia las borra. */
  activities?: SupplierActivity[];
  productLines?: SupplierProductLine[];
  exporter?: boolean | null;
  orderEmails?: string[];
  /* La lista entera: un area que no viene queda sin contacto. */
  contacts?: OrganizationContact[];
}

export interface ConfirmSupplierDocumentRequest {
  type: OrganizationDocumentType;
  storageKey: string;
  filename?: string;
}

/* Lo que se envia. Las cinco aceptaciones van en true porque el backend las
   exige en la peticion: la firma tiene que constar en lo que se mando. */
export interface SaveSupplierDeclarationRequest {
  lawfulOrigin: true;
  lawfulUse: true;
  listsAuthorization: true;
  truthfulInformation: true;
  dataPolicy: true;
  fundsOrigin: string;
  isPep: boolean;
  internationalOperations: boolean;
  internationalOperationTypes: InternationalOperationType[];
  otherOperation: string | null;
  operationCountries: string | null;
  currencies: string[];
  marketingConsent: boolean;
}

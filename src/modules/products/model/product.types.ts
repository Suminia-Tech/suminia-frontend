/* Contrato con el backend de Suminia (/products). Es la frontera donde de
   verdad se rompen las cosas, asi que se tipa explicitamente en vez de dejar
   `any`. */

/* Lo que el producto es ante el INVIMA, que decide lo que se le pide al
   proveedor: un medicamento se elige del maestro, un dispositivo medico adjunta
   sus soportes, y los demas declaran su registro sanitario. No es la categoria,
   que es como se navega el catalogo. */
export type ProductType =
  | 'MEDICAL_DEVICE'
  | 'MEDICINE'
  | 'IN_VITRO_DIAGNOSTIC'
  | 'HOSPITAL_SUPPLY'
  | 'DISINFECTANT';

/* Los medicamentos estan excluidos de IVA por el articulo 424 del Estatuto
   Tributario; entre los insumos hay gravados al 19%, al 5% y excluidos, de modo
   que lo declara el proveedor. Excluido y exento son los dos cero para el
   comprador, pero solo el exento da derecho a descontar el IVA de los insumos. */
export type TaxCategory = 'EXCLUIDO' | 'EXENTO' | 'IVA_5' | 'IVA_19';

/* DRAFT es el producto que el proveedor prepara sin exponerlo. Al enviarlo
   queda PENDING_REVIEW hasta que direccion tecnica lo aprueba (ACTIVE, el que
   ve el comprador) o lo devuelve con un motivo (REJECTED). INACTIVE es el
   retirado sin perder su historico. */
export type ProductStatus = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'INACTIVE';

/* Los soportes de un dispositivo medico. El CCAA solo se exige a quien lo
   fabrica o lo importa. */
export type ProductDocumentType = 'SANITARY_REGISTRATION' | 'TECHNICAL_SHEET' | 'CCAA';

/* Sin URL: viven en la parte privada del bucket y el enlace se firma al
   abrirlos, con su propia llamada. */
export interface ProductDocument {
  id: string;
  type: ProductDocumentType;
  filename: string | null;
  createdAt: string;
}

/* "A partir de esta cantidad, este precio". Por debajo del primer escalon rige
   el precio base del formato. */
export interface PriceTier {
  minQuantity: number;
  price: number;
}

export interface ProductPresentation {
  id: string;
  name: string;
  packaging: string;
  sku: string | null;
  barcode: string | null;
  /* La cantidad va aparte del envase para poder calcular el precio por unidad
     de contenido y comparar formatos entre proveedores. */
  contentQuantity: number | null;
  contentUnit: string | null;
  attributes: unknown;
  /* Nulo cuando quien pregunta no esta autorizado a verlo: el backend no lo
     manda. No es que el formato no tenga precio, es que no llega — y por eso no
     se puede sacar de la respuesta con las herramientas del navegador.

     Autorizado quiere decir con sesion y con la empresa aprobada por Suminia. */
  price: number | null;
  currency: string;
  stock: number;
  /* Lo que separa vender a empresas de vender al publico: el minimo que el
     proveedor despacha y el multiplo en que empaca. */
  minOrderQuantity: number;
  orderMultiple: number;
  /* Ordenados por cantidad, tal como los devuelve el backend. */
  priceTiers: PriceTier[];
  /* La presentacion del maestro que este formato ofrece. El CUM se lee de ahi:
     no lo teclea el proveedor. */
  catalogPresentationId: string | null;
  cum: string | null;
  catalogDescription: string | null;
  isDefault: boolean;
}

/* --- El maestro del INVIMA --- */

export interface CatalogPrincipio {
  nombre: string;
  cantidad: string | null;
  unidad: string | null;
}

export interface CatalogMedicine {
  id: string;
  expediente: string;
  producto: string;
  titular: string | null;
  registroSanitario: string;
  fechaVencimiento: string | null;
  formaFarmaceutica: string | null;
  viasAdministracion: string[];
  atc: string | null;
  descripcionAtc: string | null;
  principiosActivos: CatalogPrincipio[];
  activo: boolean;
}

/* Una fila del buscador: sin presentaciones, que son decenas por expediente. */
export interface CatalogMedicineSearchResult {
  id: string;
  producto: string;
  titular: string | null;
  registroSanitario: string;
  formaFarmaceutica: string | null;
  atc: string | null;
  principiosActivos: CatalogPrincipio[];
  presentationCount: number;
}

export interface CatalogPresentation {
  id: string;
  cum: string;
  consecutivo: string;
  cantidad: number | null;
  unidad: string | null;
  descripcionComercial: string | null;
  muestraMedica: boolean;
}

export interface CatalogMedicineDetail extends CatalogMedicine {
  presentations: CatalogPresentation[];
}

/* La oferta de otro proveedor para el mismo medicamento. Es lo que convierte el
   catalogo en un mercado: sin esto el comprador ve una ficha y no sabe que hay
   otras cuatro empresas vendiendo exactamente lo mismo. */
export interface MedicineOffer {
  productId: string;
  organizationId: string;
  organizationName: string | null;
  brand: string | null;
  fromPrice: number | null;
  currency: string;
  presentationCount: number;
  inStock: boolean;
}

/* Debe coincidir con MAX_PRODUCT_IMAGES del backend, que es quien lo hace
   cumplir: aqui solo sirve para dibujar los huecos que faltan y no ofrecer una
   subida que va a acabar en 422. */
export const MAX_PRODUCT_IMAGES = 6;

export interface ProductImage {
  id: string;
  /* Clave del objeto en S3. La usa el backend; las pantallas pintan `url`. */
  storageKey: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  organizationId: string;
  organizationName: string | null;
  categoryId: string;
  categoryName: string | null;
  type: ProductType;
  status: ProductStatus;
  name: string;
  description: string | null;
  brand: string | null;
  manufacturer: string | null;
  /* Referencia o modelo. Otra referencia es otro producto; las presentaciones
     son las formas de vender esta. */
  reference: string | null;
  /* Lo declara el proveedor. Un medicamento lo lee de `catalogMedicine`. */
  sanitaryRegistration: string | null;
  isManufacturerOrImporter: boolean;
  taxCategory: TaxCategory;
  catalogMedicineId: string | null;
  catalogMedicine: CatalogMedicine | null;
  attributes: unknown;
  /* Cuantas ofertas hay del mismo medicamento, esta incluida. 0 en un insumo,
     que no tiene maestro por el que agruparse. */
  offerCount: number;
  presentations: ProductPresentation[];
  images: ProductImage[];
  /* Vacio para quien no es el dueño ni personal de Suminia. */
  documents: ProductDocument[];
  /* Los que cualquiera puede abrir desde la ficha: registro sanitario y ficha
     tecnica de un producto publicado. */
  publicDocuments?: ProductDocument[];
  /* Las condiciones del proveedor que se leen en la ficha: desde cuanto
     despacha (sin IVA; null es sin minimo) y en cuantos dias habiles.
     Opcionales los dos: un backend anterior no los manda, y una ficha no se
     puede caer por un dato de apoyo. */
  supplierPolicy?: {
    minOrderValue: number | null;
    deliveryDaysMin: number | null;
    deliveryDaysMax: number | null;
  };
  submittedAt: string | null;
  reviewedAt: string | null;
  /* El motivo del ultimo rechazo, hasta que se vuelve a enviar. */
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
}

/* Campos por los que el backend acepta ordenar (ALLOWED_SORT del repositorio).
   Pedirle cualquier otro responde 400, de modo que se tipa aqui para que la
   pantalla no pueda inventarse uno. */
export type SortField =
  | 'name'
  | 'brand'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'submittedAt';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  position: number;
  /* El grupo regulatorio de la categoria. Decide lo que se le pide a un
     producto publicado en ella: el proveedor no elige tipo aparte. */
  productType: ProductType;
  /* Productos publicados y de empresas habilitadas: lo que de verdad se va a
     encontrar al entrar en ella. */
  productCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  /* Si no viaja, el backend lo deriva del nombre. */
  slug?: string;
  position?: number;
  productType?: ProductType;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest> & {
  state?: boolean;
};

/* --- Peticiones --- */

export interface PresentationRequest {
  /* El nombre no se envia: lo compone el backend a partir del empaque, la
     cantidad, la unidad y la variante. Pedirlo aparte era declarar dos veces el
     mismo dato, y las dos versiones se separaban al editar una sola. */
  variant?: string;
  packaging: string;
  sku?: string;
  barcode?: string;
  /* La presentacion del maestro que este formato ofrece. Obligatoria si el
     producto es un medicamento: el CUM sale de ahi, no se teclea. */
  catalogPresentationId?: string | null;
  /* Obligatorias y juntas: de ellas sale el precio por unidad, que es lo que
     hace comparable un formato con otro. El backend las exige al crear. */
  contentQuantity: number;
  contentUnit: string;
  price: number;
  currency?: string;
  stock?: number;
  minOrderQuantity?: number;
  orderMultiple?: number;
  priceTiers?: PriceTier[];
  isDefault?: boolean;
}

export interface CreateProductRequest {
  /* De ella sale el tipo del producto: no se manda aparte. */
  categoryId: string;
  status?: ProductStatus;
  name: string;
  description?: string;
  brand?: string;
  manufacturer?: string;
  /* null y no ausente para vaciarlo al editar: ausente es "no lo toques". */
  reference?: string | null;
  sanitaryRegistration?: string | null;
  isManufacturerOrImporter?: boolean;
  catalogMedicineId?: string | null;
  taxCategory?: TaxCategory;
  attributes?: Record<string, unknown>;
  /* Al menos uno: sin formatos el producto no tiene precio ni inventario, y el
     backend responde 422. */
  presentations: PresentationRequest[];
}

export type UpdateProductRequest = Partial<Omit<CreateProductRequest, 'presentations'>>;

export type UpdatePresentationRequest = Partial<PresentationRequest>;

/* --- Subida de imagenes --- */

/* Permiso temporal que devuelve el backend. Los bytes van del navegador
   directo a S3: `fields` lleva la politica firmada y debe adjuntarse al
   formulario antes del archivo. */
export type { UploadTicket } from '@/shared/api/types';

export interface ConfirmImageRequest {
  storageKey: string;
  alt?: string;
  position?: number;
}

export interface UpdateImageRequest {
  alt?: string;
  position?: number;
  isPrimary?: boolean;
}

/* --- Documentos y revision --- */

export interface ConfirmDocumentRequest {
  type: ProductDocumentType;
  storageKey: string;
  filename?: string;
}

export interface DocumentUrl {
  url: string;
  expiresIn: number;
}

export type ReviewDecision = 'APPROVE' | 'REJECT';

export interface ReviewProductRequest {
  decision: ReviewDecision;
  /* Obligatorio al rechazar: el proveedor necesita saber que corregir. */
  note?: string;
}

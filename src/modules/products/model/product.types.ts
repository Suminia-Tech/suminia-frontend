/* Contrato con el backend de Suminia (/products). Es la frontera donde de
   verdad se rompen las cosas, asi que se tipa explicitamente en vez de dejar
   `any`. */

/* Un insumo lo describe su proveedor; un medicamento se elige del maestro del
   INVIMA y sus datos regulatorios se leen de ahi. */
export type ProductType = 'SUPPLY' | 'MEDICINE';

/* Los medicamentos estan excluidos de IVA por el articulo 424 del Estatuto
   Tributario; entre los insumos hay gravados al 19%, al 5% y excluidos, de modo
   que lo declara el proveedor. Excluido y exento son los dos cero para el
   comprador, pero solo el exento da derecho a descontar el IVA de los insumos. */
export type TaxCategory = 'EXCLUIDO' | 'EXENTO' | 'IVA_5' | 'IVA_19';

/* DRAFT es el producto que el proveedor prepara sin exponerlo, ACTIVE el que
   ve el comprador, INACTIVE el retirado sin perder su historico. */
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

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
  taxCategory: TaxCategory;
  catalogMedicineId: string | null;
  catalogMedicine: CatalogMedicine | null;
  attributes: unknown;
  /* Cuantas ofertas hay del mismo medicamento, esta incluida. 0 en un insumo,
     que no tiene maestro por el que agruparse. */
  offerCount: number;
  presentations: ProductPresentation[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

/* Campos por los que el backend acepta ordenar (ALLOWED_SORT del repositorio).
   Pedirle cualquier otro responde 400, de modo que se tipa aqui para que la
   pantalla no pueda inventarse uno. */
export type SortField = 'name' | 'brand' | 'status' | 'createdAt' | 'updatedAt';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  position: number;
  /* Productos publicados y de empresas habilitadas: lo que de verdad se va a
     encontrar al entrar en ella. */
  productCount: number;
}

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
  categoryId: string;
  type?: ProductType;
  status?: ProductStatus;
  name: string;
  description?: string;
  brand?: string;
  manufacturer?: string;
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
export interface UploadTicket {
  uploadUrl: string;
  fields: Record<string, string>;
  storageKey: string;
  maxBytes: number;
  expiresIn: number;
}

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

/* Contrato con el backend de Suminia (/products). Es la frontera donde de
   verdad se rompen las cosas, asi que se tipa explicitamente en vez de dejar
   `any`. */

/* El tipo discrimina la forma de `attributes`. Hoy solo hay insumos; los
   medicamentos llegan despues y traeran CUM y registro INVIMA. */
export type ProductType = 'SUPPLY' | 'MEDICINE';

/* DRAFT es el producto que el proveedor prepara sin exponerlo, ACTIVE el que
   ve el comprador, INACTIVE el retirado sin perder su historico. */
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

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
  /* Numero, no cadena: el backend convierte el Decimal de Prisma antes de
     serializar. */
  price: number;
  currency: string;
  stock: number;
  isDefault: boolean;
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
  attributes: unknown;
  presentations: ProductPresentation[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  position: number;
}

/* --- Peticiones --- */

export interface PresentationRequest {
  name: string;
  packaging: string;
  sku?: string;
  barcode?: string;
  contentQuantity?: number;
  contentUnit?: string;
  price: number;
  currency?: string;
  stock?: number;
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

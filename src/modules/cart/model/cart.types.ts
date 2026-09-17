/* Contrato del carrito con el backend.

   Los importes vienen calculados de alla: precio de la cantidad —con el escalon
   por volumen que corresponda—, IVA por producto y subtotal por proveedor. Aqui
   no se suma nada: el total que se enseña tiene que ser el que se va a cobrar, y
   dos sitios sumando por separado acaban discrepando. */

export type TaxCategory = 'EXCLUIDO' | 'EXENTO' | 'IVA_5' | 'IVA_19';

export interface CartItem {
  id: string;
  presentationId: string;
  productId: string;
  productName: string;
  presentationName: string;
  packaging: string;
  imageUrl: string | null;

  quantity: number;
  /** El de esta cantidad: si alcanza un escalon, ya viene rebajado. */
  unitPrice: number;
  /** El de una unidad suelta, para poder enseñar cuanto se ahorra. */
  basePrice: number;
  subtotal: number;
  taxCategory: TaxCategory;
  tax: number;
  total: number;
  currency: string;

  minOrderQuantity: number;
  orderMultiple: number;
  stock: number;
}

/* Un proveedor y lo que se le va a pedir. Cada uno despacha y factura por su
   cuenta, de modo que un carrito con tres es, al confirmar, tres pedidos. */
export interface CartSupplierGroup {
  organizationId: string;
  organizationName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;

  /* Lo menos que este proveedor despacha. Null es "sin minimo", y entonces
     `meetsMinimum` es true: no hay nada que alcanzar.

     Se mide contra el subtotal y no contra el total: el IVA no es plata del
     proveedor. */
  minOrderValue: number | null;
  meetsMinimum: boolean;
}

export interface Cart {
  id: string;
  groups: CartSupplierGroup[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
}

export interface AddCartItemRequest {
  presentationId: string;
  /** Se suma a lo que ya haya de ese formato. */
  quantity: number;
}

export interface UpdateCartItemRequest {
  id: string;
  /** La cantidad final, no el aumento. */
  quantity: number;
}

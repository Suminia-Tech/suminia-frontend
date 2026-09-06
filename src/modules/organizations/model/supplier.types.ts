import type { Organization } from './organization.types';

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
}

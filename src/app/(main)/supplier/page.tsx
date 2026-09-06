import { redirect } from 'next/navigation';

/* La raiz del area entra por la cuenta: es el resumen de la empresa, y desde
   ahi el proveedor decide si va a su catalogo. */
export default function ProveedorPage() {
  redirect('/supplier/account');
}

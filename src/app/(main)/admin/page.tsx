import { redirect } from 'next/navigation';

/* El personal interno entra a revisar empresas: la primera pantalla util es el
   listado de proveedores. */
export default function AdminPage() {
  redirect('/admin/suppliers');
}

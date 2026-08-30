import { redirect } from 'next/navigation';

/* La raiz del area no tiene pantalla propia: lo primero que hace un proveedor
   es mirar su catalogo, de modo que /proveedor lleva alli en vez de ofrecer un
   panel vacio de bienvenida. */
export default function ProveedorPage() {
  redirect('/proveedor/productos');
}

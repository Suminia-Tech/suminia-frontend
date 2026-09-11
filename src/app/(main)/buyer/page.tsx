import { redirect } from 'next/navigation';

/* El comprador compra en la tienda, que es la misma que ve un visitante: su
   cabecera con buscador, categorias y carrito, y los precios visibles si su
   empresa esta aprobada. Lo que cuelga de /buyer es solo su cuenta. */
export default function CompradorPage() {
  redirect('/');
}

import { PageSkeleton } from '@/shared/ui';

/* Lo que se ve al navegar dentro de la tienda mientras llega la pagina: el
   encabezado de la tienda se queda —es del layout— y el cuerpo muestra su
   esqueleto. Sin esto Next esperaba la respuesta del servidor con la pagina
   anterior congelada, y el clic parecia no hacer nada. */
export default function Loading() {
  return (
    <div className='container'>
      <PageSkeleton variant='list' />
    </div>
  );
}

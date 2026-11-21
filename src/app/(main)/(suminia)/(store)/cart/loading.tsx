import { PageSkeleton } from '@/shared/ui';

/* El carrito y la confirmacion mientras llegan: la misma forma a dos columnas
   que pintan al cargar, dentro del encabezado de la tienda. */
export default function Loading() {
  return (
    <div className='container'>
      <PageSkeleton variant='detail' />
    </div>
  );
}

import { PageSkeleton } from '@/shared/ui';

/* La ficha mientras llega: el chasis del area se queda y el cuerpo muestra
   el esqueleto a dos columnas de una ficha. */
export default function Loading() {
  return <PageSkeleton variant='detail' />;
}

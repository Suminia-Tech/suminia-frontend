import { PageSkeleton } from '@/shared/ui';

/* Los indicadores mientras llegan: cifras y graficas. El chasis del area se queda —es del layout— y el cuerpo muestra la
   misma forma que pinta la pantalla mientras carga sus datos, para que al
   llegar no cambie de figura. */
export default function Loading() {
  return <PageSkeleton variant='dashboard' />;
}

import { PageSkeleton } from '@/shared/ui';

/* Lo que se ve al navegar dentro del area mientras llega la pagina: el
   chasis —encabezado o panel lateral— es del layout y se queda; el cuerpo
   muestra su esqueleto. Sin esto Next esperaba la respuesta del servidor con
   la pagina anterior congelada, y el clic parecia no hacer nada. */
export default function Loading() {
  return <PageSkeleton variant='list' />;
}

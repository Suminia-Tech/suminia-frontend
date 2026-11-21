import { PageSkeleton } from '@/shared/ui';

/* Un formulario mientras llega: paneles de campos. El encabezado de la tienda y el menu de la cuenta se quedan —son del
   layout— y el cuerpo muestra la misma forma que pinta la pantalla mientras
   carga sus datos, para que al llegar no cambie de figura. */
export default function Loading() {
  return <PageSkeleton variant='form' />;
}

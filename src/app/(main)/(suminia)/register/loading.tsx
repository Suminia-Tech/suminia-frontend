import { PageSkeleton } from '@/shared/ui';

/* Pagina de tramite, sin encabezado de tienda: el esqueleto de un formulario,
   solo. Sin este archivo heredaria el de la portada, que si trae encabezado, y
   el menu apareceria un instante para desaparecer. */
export default function Loading() {
  return (
    <div className='container py-5'>
      <PageSkeleton variant='form' />
    </div>
  );
}

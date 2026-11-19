import Layout6 from '@/_template/Layout/Layout6';
import { PageSkeleton } from '@/shared/ui';

/* Estas paginas montan su propio encabezado de tienda, de modo que mientras
   llegan se pinta el mismo encabezado con el esqueleto debajo: el menu no
   desaparece y el clic cambia de pantalla al instante. */
export default function Loading() {
  return (
    <Layout6 isCategories={true}>
      <div className='store-page'>
        <div className='container'>
          <PageSkeleton variant='list' />
        </div>
      </div>
    </Layout6>
  );
}

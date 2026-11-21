'use client';

import { PageSkeleton, ShellSkeleton } from './Skeleton';

/* La espera de algo que no es cargar datos —entrar, salir, confirmar un
   pedido—.

   Antes era el velo de la plantilla: ocho barras azules girando sobre la
   pagina, que se veia como un error de carga. Ahora es una barra fina arriba
   y, solo cuando se llega a una pantalla con otro chasis —entrar al area del
   proveedor o del personal, con su panel lateral—, el esqueleto de esa
   pantalla tal como va a aparecer. Cuando el destino se pinta dentro del
   mismo encabezado —salir a la tienda, ir al pedido recien hecho—, basta la
   barra: ese destino ya muestra su propio esqueleto, y taparlo con otro que no
   coincide se veia como un salto.

   Siempre montado, y lo que se ve lo decide el CSS: aparece con un cuarto de
   segundo de espera y un fundido, y se va desvaneciendose. */
type Variant = 'list' | 'detail' | 'form' | 'dashboard' | 'summary';

export const LoadingOverlay = ({
  isOpen,
  variant = 'list',
  skeleton = 'none',
}: {
  isOpen: boolean;
  /** La forma de la pantalla a la que se va. */
  variant?: Variant;
  /** 'shell': con panel lateral; 'page': una pagina suelta; 'none': solo la barra. */
  skeleton?: 'shell' | 'page' | 'none';
}) => (
  <div
    className={`page-loading-veil${isOpen ? ' is-open' : ''}${skeleton === 'none' ? ' is-bar-only' : ''}${skeleton === 'shell' ? ' is-shell' : ''}`}
    role='status'
    aria-live='polite'
    aria-hidden={!isOpen}
  >
    {isOpen && <span className='visually-hidden'>Cargando</span>}
    <span className='page-loading-bar' aria-hidden='true' />
    {skeleton === 'shell' && <ShellSkeleton variant={variant} />}
    {skeleton === 'page' && (
      <div className='page-loading-content' aria-hidden='true'>
        <PageSkeleton variant={variant} />
      </div>
    )}
  </div>
);

export default LoadingOverlay;

'use client';

import { PageSkeleton } from './Skeleton';

/* La espera de algo que no es cargar datos —entrar, salir, confirmar un
   pedido—, que termina llevando a otra pantalla.

   Antes era el velo de la plantilla: ocho barras azules girando sobre la
   pagina, que se veia como un error de carga y no como parte de la app. Ahora
   se muestra lo que viene —los esqueletos de la pantalla de destino, los
   mismos que pinta cada pagina mientras carga sus datos— y una barra fina
   arriba que dice que algo avanza.

   Siempre montado, y lo que se ve lo decide el CSS: aparece con un cuarto de
   segundo de espera y un fundido, y se va desvaneciendose. Una espera corta
   termina antes de que aparezca; montarlo y desmontarlo de golpe lo hacia
   destellar unas centesimas, que se veia como un fallo. */
export const LoadingOverlay = ({
  isOpen,
  variant = 'list',
  skeleton = true,
}: {
  isOpen: boolean;
  /** La forma de la pantalla a la que se va. */
  variant?: 'list' | 'detail' | 'form' | 'dashboard';
  /** Falso: solo la barra, cuando no se cambia de pantalla. */
  skeleton?: boolean;
}) => (
  <div
    className={`page-loading-veil${isOpen ? ' is-open' : ''}${skeleton ? '' : ' is-bar-only'}`}
    role='status'
    aria-live='polite'
    aria-hidden={!isOpen}
  >
    {isOpen && <span className='visually-hidden'>Cargando</span>}
    <span className='page-loading-bar' aria-hidden='true' />
    {skeleton && (
      <div className='page-loading-content' aria-hidden='true'>
        <PageSkeleton variant={variant} />
      </div>
    )}
  </div>
);

export default LoadingOverlay;

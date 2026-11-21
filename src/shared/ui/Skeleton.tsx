/* Esqueletos de carga: la forma de lo que viene, en vez de un "Cargando...".

   Conservan el alto y la disposicion de la pantalla, de modo que el contenido
   no salta cuando llega y se entiende de entrada que tipo de pagina es. Se
   pintan con las mismas cajas que el contenido real —panel, columnas de la
   ficha, tarjetas de cifras— para que el paso de uno al otro sea un relleno y
   no un cambio de pantalla.

   El texto "Cargando" sigue ahi para los lectores de pantalla, oculto. */

import type { ReactNode } from 'react';

/* Filas sueltas, para lo que carga dentro de un panel o de una tabla. */
export const SkeletonRows = ({ rows = 5, thumb = false }: { rows?: number; thumb?: boolean }) => (
  <div className='catalog-skeleton' aria-hidden='true'>
    {Array.from({ length: rows }).map((_, index) => (
      <div className='catalog-skeleton-row' key={index}>
        {thumb && <span className='sk sk-thumb' />}
        <span className='sk sk-line' />
        <span className='sk sk-short' />
      </div>
    ))}
  </div>
);

const SkeletonPanel = ({ children, title = true }: { children: ReactNode; title?: boolean }) => (
  <section className='panel'>
    {title && (
      <header className='panel-head'>
        <span className='sk sk-heading' />
      </header>
    )}
    <div className='panel-body'>{children}</div>
  </section>
);

const SkeletonFields = ({ count }: { count: number }) => (
  <div className='form-grid'>
    {Array.from({ length: count }).map((_, index) => (
      <div className='skeleton-field' key={index}>
        <span className='sk sk-label' />
        <span className='sk sk-input' />
      </div>
    ))}
  </div>
);

type Variant = 'list' | 'detail' | 'form' | 'dashboard' | 'summary';

/* La pantalla entera: titulo y el cuerpo segun el tipo de pagina.
   - list: una lista o tabla dentro de un panel.
   - detail: la ficha a dos columnas, como la de un pedido.
   - form: paneles con campos.
   - dashboard: tarjetas de cifras y un bloque grande.
   - summary: el resumen del personal, lo pendiente y la facturacion del mes. */
export const PageSkeleton = ({
  variant = 'list',
  header = true,
}: {
  variant?: Variant;
  /** Sin titulo, si la pantalla ya pinta el suyo. */
  header?: boolean;
}) => (
  <div className='page-skeleton' aria-busy='true'>
    <span className='visually-hidden'>Cargando</span>
    {header && (
      <div className='page-skeleton-head' aria-hidden='true'>
        <span className='sk sk-title' />
        <span className='sk sk-subtitle' />
      </div>
    )}

    <div aria-hidden='true'>
      {variant === 'list' && (
        <SkeletonPanel>
          <SkeletonRows rows={6} />
        </SkeletonPanel>
      )}

      {variant === 'detail' && (
        <div className='order-layout'>
          <div className='order-main'>
            <SkeletonPanel>
              <SkeletonRows rows={4} thumb />
            </SkeletonPanel>
            <SkeletonPanel>
              <SkeletonRows rows={3} />
            </SkeletonPanel>
          </div>
          <aside className='order-side'>
            <SkeletonPanel>
              <SkeletonRows rows={3} />
            </SkeletonPanel>
            <SkeletonPanel>
              <SkeletonRows rows={2} />
            </SkeletonPanel>
          </aside>
        </div>
      )}

      {variant === 'form' && (
        <>
          <SkeletonPanel>
            <SkeletonFields count={6} />
          </SkeletonPanel>
          <SkeletonPanel>
            <SkeletonFields count={4} />
          </SkeletonPanel>
        </>
      )}

      {variant === 'summary' && (
        <>
          <SkeletonPanel>
            <SkeletonRows rows={3} />
          </SkeletonPanel>
          <SkeletonPanel>
            <div className='data-list'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div className='skeleton-field' key={index}>
                  <span className='sk sk-label' />
                  <span className='sk sk-short' />
                </div>
              ))}
            </div>
          </SkeletonPanel>
        </>
      )}

      {variant === 'dashboard' && (
        <>
          <SkeletonPanel>
            <div className='kpi-grid'>
              {Array.from({ length: 3 }).map((_, index) => (
                <div className='kpi-tile' key={index}>
                  <span className='sk sk-label' />
                  <span className='sk sk-figure' />
                </div>
              ))}
            </div>
          </SkeletonPanel>
          <SkeletonPanel>
            <span className='sk sk-chart' />
          </SkeletonPanel>
          <SkeletonPanel>
            <SkeletonRows rows={4} />
          </SkeletonPanel>
        </>
      )}
    </div>
  </div>
);

/* El chasis de las areas de trabajo —panel lateral, barra de arriba y el
   cuerpo— mientras se entra a una. Con las mismas clases que SidebarShell,
   de modo que al llegar la pantalla real ocupa exactamente el mismo sitio:
   el esqueleto de una pagina suelta, a todo el ancho, no se parecia a lo que
   aparecia despues. */
export const ShellSkeleton = ({ variant = 'list' }: { variant?: Variant }) => (
  <div className='area-layout' aria-busy='true'>
    <span className='visually-hidden'>Cargando</span>
    <aside className='area-sidebar' aria-hidden='true'>
      <div className='area-sidebar-brand'>
        <span className='sk sk-logo' />
      </div>
      <div className='area-sidebar-nav'>
        {[3, 2, 2, 3].map((items, grupo) => (
          <div className='area-sidebar-group' key={grupo}>
            <span className='sk sk-nav-label' />
            {Array.from({ length: items }).map((_, index) => (
              <span className='sk sk-nav-item' key={index} />
            ))}
          </div>
        ))}
      </div>
    </aside>
    <div className='area-main'>
      <header className='area-topbar' aria-hidden='true'>
        <span className='sk sk-short' />
        <span className='sk sk-avatar' />
      </header>
      <main className='area-content'>
        <PageSkeleton variant={variant} />
      </main>
    </div>
  </div>
);

export default PageSkeleton;

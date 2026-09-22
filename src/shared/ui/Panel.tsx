import type { ReactNode } from 'react';

/* La caja blanca en la que va el contenido de una pantalla de panel.

   Antes no habia ninguna: los campos y las listas flotaban sueltos sobre el
   gris del area, separados solo por titulos. Un formulario asi no tiene donde
   empezar ni donde acabar, y con los campos en blanco sobre un fondo gris lo
   que se ve son cajas sueltas en vez de un bloque.

   El panel agrupa, y al agrupar permite lo demas: que el boton de guardar viva
   al pie del bloque que guarda —en vez de suelto debajo del ultimo campo—, y
   que una pantalla con varios asuntos los separe sin inventarse un titulo cada
   vez.

   `footer` existe para eso: lo que se pone ahi se alinea a la derecha sobre una
   linea, que es donde se busca el boton de guardar de un formulario. */

interface PanelProps {
  title?: string;
  description?: string;
  /** A la derecha del titulo del panel: una accion secundaria o un estado. */
  aside?: ReactNode;
  footer?: ReactNode;
  /** Formularios: acota el ancho para que un campo no mida 1600px. */
  narrow?: boolean;
  className?: string;
  children: ReactNode;
}

export const Panel = ({
  title,
  description,
  aside,
  footer,
  narrow = false,
  className,
  children,
}: PanelProps) => (
  <section className={`panel${narrow ? ' is-narrow' : ''}${className ? ` ${className}` : ''}`}>
    {(title || aside) && (
      <header className='panel-head'>
        <div>
          {title && <h2>{title}</h2>}
          {description && <p className='font-light'>{description}</p>}
        </div>
        {aside && <div className='panel-head-aside'>{aside}</div>}
      </header>
    )}

    <div className='panel-body'>{children}</div>

    {footer && <footer className='panel-foot'>{footer}</footer>}
  </section>
);

export default Panel;

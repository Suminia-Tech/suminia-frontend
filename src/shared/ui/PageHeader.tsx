import type { ReactNode } from 'react';

/* La cabecera de una pantalla de panel: de que va y que se puede hacer en ella.

   Existe porque cada pantalla titulaba a su manera. Unas con `box-head`, otras
   con un `h2` suelto, otras con el nombre de la empresa en lugar del nombre de
   la seccion, y ninguna decia para que sirve la pantalla: el usuario tenia que
   deducirlo del formulario que encontrara debajo.

   La descripcion no es decoracion. En un panel donde todo son campos, es lo
   unico que distingue "Mi perfil" —tus datos— de "Mi empresa" —los de la
   empresa—, que es una confusion real cuando las dos pantallas piden un correo
   y un telefono.

   Vive en `shared/` porque la usan pantallas de cuatro modulos distintos y un
   modulo nunca importa otro. */

interface PageHeaderProps {
  title: string;
  description?: string;
  /** El boton principal de la pantalla, a la derecha del titulo. */
  action?: ReactNode;
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => (
  <header className='page-header'>
    <div className='page-header-text'>
      <h1>{title}</h1>
      {description && <p className='font-light'>{description}</p>}
    </div>
    {action && <div className='page-header-action'>{action}</div>}
  </header>
);

export default PageHeader;

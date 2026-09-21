import Link from 'next/link';
import { ChevronRight } from 'react-feather';

/* El rastro de la tienda: Inicio / Catálogo / Producto.

   Sustituye al "Volver al catálogo" que solo tenia la ficha de producto. Un
   enlace de volver dice de donde se sale pero no donde se esta, y en el
   catalogo no habia nada: quien entraba desde un buscador se encontraba una
   pagina sin salida hacia arriba.

   El ultimo tramo no es enlace —es la pagina en la que se esta— y por eso
   lleva `aria-current`. Va en una `<nav>` con nombre para que un lector de
   pantalla lo anuncie como lo que es y se pueda saltar.

   Es un componente de `shared/` y no de un modulo porque lo usan cuatro
   pantallas de tres modulos distintos —productos, carrito y ordenes— y un
   modulo nunca importa otro. */

export interface BreadcrumbStep {
  label: string;
  /** Sin `href` es el tramo actual: se pinta sin enlace. */
  href?: string;
}

export const Breadcrumbs = ({ steps }: { steps: BreadcrumbStep[] }) => {
  if (steps.length === 0) return null;

  return (
    <nav aria-label='Ruta de navegación' className='suminia-breadcrumbs'>
      <ol>
        {steps.map((step, index) => {
          const last = index === steps.length - 1;

          return (
            <li key={`${step.label}-${index}`}>
              {step.href && !last ? (
                <Link href={step.href}>{step.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>
                  {step.label}
                </span>
              )}
              {!last && <ChevronRight size={14} aria-hidden='true' />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

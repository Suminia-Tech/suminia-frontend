'use client';

import Link from 'next/link';

/* Las pestañas de una pantalla con varias secciones: configuracion, las
   bandejas de pagos. Cada seccion se ve sola, en vez de una pagina larga que
   hay que recorrer entera para encontrar un campo.

   Van dentro de la pantalla y no en el menu lateral. El menu se reserva para
   cuando una seccion crece tanto que merece su propia entrada.

   Una pestaña puede ser un enlace —cuando la seccion es su propia ruta, como
   cada bandeja de pagos— o un boton que cambia lo que se ve sin salir de la
   pagina. La forma es la de las pestañas de categoria de la portada: pildora,
   y el azul de la marca para la elegida. */

export interface PageTab {
  key: string;
  label: string;
  /** Si la seccion tiene su propia ruta. Sin el, la pestaña es un boton. */
  href?: string;
}

interface PageTabsProps {
  tabs: PageTab[];
  active: string;
  /** Al elegir una pestaña. En las de ruta avisa del clic, para marcarla
      sin esperar a que llegue la pagina. */
  onSelect?: (key: string) => void;
  label: string;
}

export const PageTabs = ({ tabs, active, onSelect, label }: PageTabsProps) => (
  <nav className='page-tabs' aria-label={label}>
    {tabs.map((tab) => {
      const activa = tab.key === active;
      return tab.href ? (
        <Link
          key={tab.key}
          href={tab.href}
          className={activa ? 'active' : undefined}
          aria-current={activa ? 'page' : undefined}
          onClick={() => onSelect?.(tab.key)}
        >
          {tab.label}
        </Link>
      ) : (
        <button
          key={tab.key}
          type='button'
          className={activa ? 'active' : undefined}
          aria-pressed={activa}
          onClick={() => onSelect?.(tab.key)}
        >
          {tab.label}
        </button>
      );
    })}
  </nav>
);

export default PageTabs;

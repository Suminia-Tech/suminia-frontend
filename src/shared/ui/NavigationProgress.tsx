'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/* La barra fina de arriba, en el mismo instante del clic en un enlace.

   Next cambia de pantalla cuando el servidor responde; con su loading.tsx
   pinta el esqueleto en cuanto puede, pero entre el clic y ese momento no
   habia ninguna señal, y el clic parecia no haber hecho nada. La barra sale
   con el clic y se va cuando la ruta ya cambio.

   Se recuerda de que pagina salio la navegacion y no a cual va: si se vuelve
   atras con el navegador, la barra no se queda pegada esperando un destino
   que ya no importa. */
export const NavigationProgress = () => {
  const pathname = usePathname();
  const [desde, setDesde] = useState<string | null>(null);
  const cargando = desde !== null && desde === pathname;

  useEffect(() => {
    const alPulsar = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const enlace = (event.target as Element | null)?.closest?.('a[href]');
      if (!(enlace instanceof HTMLAnchorElement)) return;
      if (enlace.target && enlace.target !== '_self') return;
      if (enlace.hasAttribute('download')) return;
      const url = new URL(enlace.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      /* Otra pagina, no un ancla ni la misma ruta con otro filtro. */
      if (url.pathname === window.location.pathname) return;
      setDesde(window.location.pathname);
    };
    document.addEventListener('click', alPulsar, true);
    return () => document.removeEventListener('click', alPulsar, true);
  }, []);

  if (!cargando) return null;
  return <span className='nav-progress' role='progressbar' aria-label='Cargando la página' />;
};

export default NavigationProgress;

'use client';

import { useEffect } from 'react';

/* Lleva al elemento del `#ancla` de la URL cuando la pantalla ya lo pinto, y
   lo resalta un momento para que se vea a donde se llego.

   Next intenta desplazarse al ancla al navegar, pero en una pantalla que carga
   sus datos el elemento todavia no existe en ese instante: se queda arriba de
   la pagina. Por eso espera a `ready`. Escucha tambien `hashchange`, para los
   enlaces a otro panel de la misma pagina. */
export const useScrollToHash = (ready: boolean) => {
  useEffect(() => {
    if (!ready) return;

    let quitarResalte: number | undefined;

    const irAlAncla = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const destino = document.getElementById(id);
      if (!destino) return;

      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      destino.classList.add('is-targeted');
      window.clearTimeout(quitarResalte);
      quitarResalte = window.setTimeout(() => destino.classList.remove('is-targeted'), 2500);
    };

    /* Un cuadro despues de que React pinte, para que el panel ya mida lo que
       mide y el desplazamiento caiga donde es. */
    const cuadro = window.requestAnimationFrame(irAlAncla);
    window.addEventListener('hashchange', irAlAncla);

    return () => {
      window.cancelAnimationFrame(cuadro);
      window.clearTimeout(quitarResalte);
      window.removeEventListener('hashchange', irAlAncla);
    };
  }, [ready]);
};

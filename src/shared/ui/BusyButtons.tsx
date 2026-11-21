'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

/* El indicador de carga de los botones, para toda la app.

   Casi todos los botones se deshabilitan mientras su peticion esta en curso,
   y nada mas: se ponen opacos, y quien los presiono no sabe si esta cargando
   o si el boton dejo de funcionar. Ponerle un estado de carga a cada uno, uno
   por uno, deja siempre alguno sin cubrir. Por eso se resuelve aqui, en un
   solo lugar:

   se recuerda el ultimo boton presionado, y si justo despues empieza una
   peticion que escribe en el backend (una mutacion de RTK Query), ese boton
   lleva el indicador hasta que la peticion termina. Un boton que no llama al
   backend —abrir un panel, cambiar de pestaña— no lo muestra nunca.

   Lee el estado del cache de RTK Query por su nombre y no por el store: shared
   no depende de store. */

type ConMutaciones = {
  suminiaApi?: { mutations?: Record<string, { status?: string } | undefined> };
};

const hayMutacionEnCurso = (state: ConMutaciones): boolean =>
  Object.values(state.suminiaApi?.mutations ?? {}).some(
    (mutacion) => mutacion?.status === 'pending',
  );

/* Cuanto puede pasar entre el clic y el comienzo de la peticion para que se
   entiendan como una sola cosa. Algunas acciones validan o suben un archivo
   antes de llamar. */
const VENTANA_MS = 1500;

const BusyButtons = () => {
  const enCurso = useSelector(hayMutacionEnCurso);
  const ultimo = useRef<{ boton: HTMLButtonElement; at: number } | null>(null);
  const marcado = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const recordar = (boton: Element | null | undefined) => {
      if (boton instanceof HTMLButtonElement) ultimo.current = { boton, at: Date.now() };
    };
    const alClic = (event: MouseEvent) =>
      recordar((event.target as Element | null)?.closest?.('button'));
    /* Enviar un formulario con Enter tambien cuenta: el boton es el que lo
       envia. */
    const alEnviar = (event: SubmitEvent) => recordar(event.submitter);

    document.addEventListener('click', alClic, true);
    document.addEventListener('submit', alEnviar, true);
    return () => {
      document.removeEventListener('click', alClic, true);
      document.removeEventListener('submit', alEnviar, true);
    };
  }, []);

  useEffect(() => {
    if (enCurso) {
      const reciente = ultimo.current;
      if (reciente && reciente.boton.isConnected && Date.now() - reciente.at < VENTANA_MS) {
        /* El color del texto, antes de volverlo transparente: es el del
           indicador. */
        reciente.boton.style.setProperty('--busy-color', getComputedStyle(reciente.boton).color);
        reciente.boton.classList.add('is-busy');
        reciente.boton.setAttribute('aria-busy', 'true');
        marcado.current = reciente.boton;
      }
      return;
    }
    if (marcado.current) {
      marcado.current.classList.remove('is-busy');
      marcado.current.style.removeProperty('--busy-color');
      marcado.current.removeAttribute('aria-busy');
      marcado.current = null;
    }
  }, [enCurso]);

  return null;
};

export default BusyButtons;

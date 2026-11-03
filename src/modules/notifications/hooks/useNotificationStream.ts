import { useEffect } from 'react';

import { baseApi } from '@/shared/api/baseApi';
import { env } from '@/shared/config/env';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { useAppDispatch } from '@/store/hooks';

/* Los avisos en tiempo real.

   Abre GET /notifications/stream y la deja abierta: el backend escribe un
   evento cada vez que le llega un aviso a esta persona, y aqui se invalida la
   campana —y los pedidos y las cifras, que es casi siempre de lo que trata el
   aviso— para que se pidan de nuevo al instante. Se invalidan los tipos
   enteros, no solo las listas: el aviso casi siempre lleva a la ficha de un
   pedido o de una liquidacion, y esa ficha tiene que estar al dia al abrirla.

   Con fetch y no con EventSource porque EventSource no deja mandar la
   cabecera Authorization, y el token no debe viajar en la URL: quedaria en
   los registros del proxy. Es la unica conexion de la app fuera de RTK Query:
   RTK no maneja respuestas que no terminan.

   Si se corta —red, despliegue, token vencido— se reintenta con espera
   creciente, hasta un minuto. */
const ESPERA_MAXIMA = 60_000;

export const useNotificationStream = (enabled: boolean) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled) return;
    const control = new AbortController();
    let espera = 1_000;
    let reintento: ReturnType<typeof setTimeout> | null = null;

    const refrescar = () =>
      dispatch(
        baseApi.util.invalidateTags(['Notification', 'Order', 'Quote', 'Payout', 'Finance']),
      );

    const conectar = async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) return;
      try {
        const res = await fetch(`${env.apiUrl}/notifications/stream`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: control.signal,
        });
        if (!res.ok || !res.body) throw new Error(`stream ${res.status}`);
        espera = 1_000;
        /* Al reconectar puede haberse perdido algo: se pide la lista. */
        refrescar();

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          if (decoder.decode(value, { stream: true }).includes('event: notification')) {
            refrescar();
          }
        }
      } catch {
        if (control.signal.aborted) return;
      }
      if (control.signal.aborted) return;
      reintento = setTimeout(conectar, espera);
      espera = Math.min(espera * 2, ESPERA_MAXIMA);
    };

    void conectar();
    return () => {
      control.abort();
      if (reintento) clearTimeout(reintento);
    };
  }, [enabled, dispatch]);
};

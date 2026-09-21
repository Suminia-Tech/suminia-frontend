'use client';

import { useSyncExternalStore } from 'react';

/* Si el navegador ya paso de la hidratacion.

   Sirve para lo que el servidor no puede pintar porque depende de la sesion, y
   que por tanto tiene que empezar apagado en las dos partes.

   Hay un `hydrated` en el estado de auth que parece hacer esto, pero no basta.
   Lo enciende un efecto de `AuthInitializer`, que vive arriba del arbol, y el
   catalogo cuelga de un `<Suspense>` —lo necesita por `useSearchParams`—: al
   reanudarse esa frontera, el efecto de arriba ya corrio y `hydrated` llega
   valiendo `true` en el primer render del contenido. El servidor habia pintado
   lo contrario, y React tiraba todo ese trozo del arbol y lo volvia a pintar.

   `useSyncExternalStore` y no un `useState` con efecto: React tiene dos
   lecturas separadas, una para el servidor y otra para el cliente, y durante la
   hidratacion usa la del servidor pase lo que pase por encima. Es la misma
   herramienta con la que el proyecto lee `localStorage`, y por la misma razon.
   La suscripcion no hace nada porque no hay nada a lo que suscribirse: el valor
   cambia una vez, al hidratar, y de eso ya se encarga React.

   Se combina con `hydrated`, que sigue haciendo falta para no enseñarle el
   aviso de precios a quien si tiene sesion mientras se lee de localStorage. */

const sinSuscripcion = () => () => {};
const enElCliente = () => true;
const enElServidor = () => false;

export const useMounted = (): boolean =>
  useSyncExternalStore(sinSuscripcion, enElCliente, enElServidor);

export default useMounted;

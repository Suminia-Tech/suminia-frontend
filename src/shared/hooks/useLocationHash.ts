'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/* El `#ancla` de la URL, sin el numeral y decodificado. Con
   useSyncExternalStore y no con un efecto: el servidor no ve la URL entera, y
   arrancar con otro valor desajustaria la hidratacion. En el servidor es
   vacio. */
export const useLocationHash = (): string =>
  useSyncExternalStore(
    subscribe,
    () => decodeURIComponent(window.location.hash.slice(1)),
    () => '',
  );

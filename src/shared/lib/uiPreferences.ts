/* Preferencias de interfaz que sobreviven a la recarga.

   Junto a tokenStorage y cookieConsent, es de los pocos sitios del proyecto que
   tocan localStorage. No guarda nada del negocio: solo como quiere cada quien
   ver la pantalla, de modo que perderlo no rompe nada.

   Todo va envuelto en try/catch porque en modo privado, o con el almacenamiento
   bloqueado, leer o escribir lanza en vez de devolver null. */

const SIDEBAR_COLLAPSED_KEY = 'ui.sidebarCollapsed';

const isBrowser = () => typeof window !== 'undefined';

/* Quien esta mirando la preferencia. Hace falta para que los componentes puedan
   leerla con useSyncExternalStore, que es la forma de consumir algo que solo
   existe en el cliente sin desajustar la hidratacion: el servidor recibe su
   propia instantanea y el navegador la suya, sin efectos de por medio. */
const listeners = new Set<() => void>();

export const uiPreferences = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  isSidebarCollapsed(): boolean {
    if (!isBrowser()) return false;

    try {
      return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setSidebarCollapsed(collapsed: boolean): void {
    if (!isBrowser()) return;

    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
    } catch {
      /* Sin almacenamiento la preferencia dura lo que la sesion, que es
         preferible a tumbar la pantalla por un ajuste cosmetico. */
    }

    listeners.forEach((listener) => listener());
  },
};

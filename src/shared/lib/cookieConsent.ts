/* Aceptacion del aviso de cookies. Vive en shared/lib junto a tokenStorage
   para que el acceso a localStorage siga concentrado en un solo sitio.

   Es una preferencia del navegador, no de la cuenta: no se borra al cerrar
   sesion ni viaja al backend. */

const CONSENT_KEY = 'cookieConsent';

const isBrowser = () => typeof window !== 'undefined';

export const cookieConsent = {
  isAccepted(): boolean {
    if (!isBrowser()) return false;

    /* Un navegador con el almacenamiento bloqueado lanza al leer. Ahi se asume
       que no hay consentimiento y se muestra el aviso: es preferible repetirlo
       a darlo por concedido. */
    try {
      return window.localStorage.getItem(CONSENT_KEY) === 'true';
    } catch {
      return false;
    }
  },

  accept(): void {
    if (!isBrowser()) return;

    try {
      window.localStorage.setItem(CONSENT_KEY, 'true');
    } catch {
      // Sin almacenamiento el aviso volvera a salir, que es el fallo benigno.
    }
  },
};

'use client';

import { LoadingOverlay } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

/* El velo mientras se cierra la sesion.

   Va montado arriba del todo, junto al modal de entrar, y no dentro del menu
   que tiene el boton: ese menu desaparece en cuanto se cierra —la cabecera del
   area, el panel lateral del proveedor— y se llevaria el velo con el justo
   cuando hace falta.

   El de entrar vive en el propio modal porque ahi el modal sigue en pantalla
   mientras se comprueban las credenciales. */
export const SessionOverlay = () => {
  const loggingOut = useAppSelector((state) => state.auth.loggingOut);

  return <LoadingOverlay isOpen={loggingOut} />;
};

export default SessionOverlay;

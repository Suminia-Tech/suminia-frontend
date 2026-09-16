'use client';

import { useAppSelector } from '@/store/hooks';

/* Quien puede comprar: alguien con sesion, que pertenezca a una empresa y que
   esa empresa este aprobada.

   Las tres condiciones son distintas y ninguna sobra. Un visitante no ve
   precios. Una empresa en revision tampoco, de modo que no tendria que meter al
   carrito. Y el personal de Suminia no pertenece a ninguna empresa: una orden
   suya no tendria a quien facturarse.

   Es lo mismo que comprueba el backend, que es quien manda; aqui solo se evita
   ofrecer un boton que iba a responder 403. */
export const useCanBuy = (): {
  canBuy: boolean;
  hydrated: boolean;
  /* Por que no puede, para quien tenga que explicarselo. Un visitante y una
     empresa en revision no son lo mismo: al primero se le pide que se registre,
     y al segundo eso le sonaria a que su solicitud no existe. */
  reason: 'anonymous' | 'pending' | 'no-organization' | null;
} => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  if (!isAuthenticated) return { hydrated, canBuy: false, reason: 'anonymous' };
  if (!user?.organizationId)
    return { hydrated, canBuy: false, reason: 'no-organization' };
  if (user.organizationStatus !== 'ACTIVE')
    return { hydrated, canBuy: false, reason: 'pending' };

  return { hydrated, canBuy: true, reason: null };
};

export default useCanBuy;

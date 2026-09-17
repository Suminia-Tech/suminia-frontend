'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { SESSION_FEEDBACK_MS } from '../lib/session';
import { logout, logoutFinished, logoutStarted } from '../model/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, hydrated } = useAppSelector((state) => state.auth);

  /* Cerrar sesion saca siempre de las paginas privadas, y se avisa de que paso.

     Borrar localStorage es instantaneo, de modo que sin esto la pantalla cambia
     de golpe y queda la duda de si se cerro o no. El velo y el aviso son la
     misma señal que se da al entrar: la sesion empieza y termina igual.

     El velo lo pinta SessionOverlay, montado arriba del todo, porque el
     componente que tiene este boton —la cabecera del area, el panel del
     proveedor— desaparece al cerrar y se lo llevaria con el. */
  const logoutUser = () => {
    dispatch(logoutStarted());
    dispatch(logout());
    router.push('/');

    window.setTimeout(() => {
      dispatch(logoutFinished());
      toast.success('Cerraste sesión', { toastId: 'logout-ok' });
    }, SESSION_FEEDBACK_MS);
  };

  return { user, isAuthenticated, hydrated, logout: logoutUser };
};

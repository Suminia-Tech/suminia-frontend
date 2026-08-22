'use client';

import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { useGetProfileQuery } from '../api/authApi';
import { useAuthInitialize } from '../hooks/useAuthInitialize';
import { logout } from '../model/authSlice';

/* Arranca la sesion en el cliente. Son dos pasos:

   1. hydrate lee localStorage, que es sincrono y evita que las pantallas
      privadas parpadeen mientras se resuelve la peticion
   2. si hay sesion, se pide el perfil para reemplazar esa copia por los datos
      actuales. Sin este paso el usuario queda congelado en como era al iniciar
      sesion, y un cambio de permisos o de empresa no se refleja hasta el
      proximo login */
export function AuthInitializer() {
  const dispatch = useAppDispatch();
  useAuthInitialize();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  const { error } = useGetProfileQuery(undefined, {
    skip: !hydrated || !isAuthenticated,
  });

  /* Un 401 aqui significa que el token guardado ya no vale. Conservar la sesion
     dejaria al usuario navegando como autenticado mientras cada peticion falla. */
  useEffect(() => {
    if (error && 'status' in error && error.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  return null;
}

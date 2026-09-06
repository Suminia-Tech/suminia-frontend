'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/store/hooks';

import { hydrate } from '../model/authSlice';

// Carga la sesión persistida al montar la app y la re-sincroniza si cambia en otra pestaña
export const useAuthInitialize = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrate());

    const sync = () => dispatch(hydrate());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [dispatch]);
};

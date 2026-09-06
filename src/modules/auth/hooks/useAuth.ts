'use client';

import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { logout } from '../model/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, hydrated } = useAppSelector((state) => state.auth);

  // Cerrar sesión siempre saca al usuario de las páginas privadas
  const logoutUser = () => {
    dispatch(logout());
    router.push('/');
  };

  return { user, isAuthenticated, hydrated, logout: logoutUser };
};

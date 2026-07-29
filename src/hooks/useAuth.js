import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser, logout } from '@/ReduxToolkit/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, hydrated, loading, error } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    return result.meta.requestStatus === 'fulfilled';
  };

  // Cerrar sesión siempre saca al usuario de las páginas privadas
  const logoutUser = () => {
    dispatch(logout());
    router.push('/');
  };

  return {
    user,
    isAuthenticated,
    hydrated,
    loading,
    error,
    login,
    logout: logoutUser,
  };
};

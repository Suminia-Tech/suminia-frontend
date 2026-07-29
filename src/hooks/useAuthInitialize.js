import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrate } from '@/ReduxToolkit/authSlice';

// Carga la sesión persistida al montar la app y la re-sincroniza si cambia en otra pestaña
export function useAuthInitialize() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrate());

    const sync = () => dispatch(hydrate());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [dispatch]);
}

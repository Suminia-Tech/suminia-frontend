'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getHomePath } from '@/modules/auth';
import { useAppSelector } from '@/store/hooks';

/* La raiz manda a cada quien a su area. Sin sesion se queda en la portada
   publica, que hoy sigue siendo la home de la plantilla.

   Va aqui y no en un middleware porque la sesion vive en localStorage y el
   servidor no puede leerla. Es tambien la razon de que la portada se pinte un
   instante antes de redirigir: mover el token a una cookie quitaria ese
   parpadeo y permitiria decidir antes de servir la pagina. */
const HomeRedirect = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;

    const destination = getHomePath(user);
    if (destination !== '/') router.replace(destination);
  }, [hydrated, isAuthenticated, user, router]);

  return null;
};

export default HomeRedirect;

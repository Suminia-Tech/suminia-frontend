'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAppSelector } from '@/store/hooks';

import { getHomePath, type Area } from '../lib/area';
import { belongsToArea } from '../lib/area';

/* Deja pasar solo a quien pertenece al area, y manda al resto a la suya.

   Es una guarda de cliente y no un middleware de Next porque la sesion vive en
   localStorage, que el servidor no puede leer. Mover el token a una cookie
   permitiria comprobarlo antes de servir la pagina; mientras tanto esto evita
   que alguien aterrice en un panel que no es suyo.

   No es la barrera de seguridad: esa es del backend, que ya responde 403 a cada
   endpoint fuera de alcance. Aqui solo se evita pintar una pantalla que despues
   se llenaria de errores. */

interface AreaGuardProps {
  area: Area;
  children: ReactNode;
}

export const AreaGuard = ({ area, children }: AreaGuardProps) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  /* Hasta que no se lea localStorage el estado esta vacio: redirigir antes
     expulsaria a un usuario que si tiene sesion. */
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  const allowed = isAuthenticated && belongsToArea(user, area);

  useEffect(() => {
    if (!hydrated || allowed) return;

    router.replace(isAuthenticated ? getHomePath(user) : '/');
  }, [hydrated, allowed, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <section className='section-b-space'>
        <div className='container'>
          <p className='font-light'>Cargando...</p>
        </div>
      </section>
    );
  }

  /* Mientras el router navega, no se pinta nada del area ajena. */
  if (!allowed) return null;

  return <>{children}</>;
};

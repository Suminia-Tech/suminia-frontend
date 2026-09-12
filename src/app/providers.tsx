'use client';

import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { AuthInitializer, LoginModal } from '@/modules/auth';
import { store } from '@/store';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
      <LoginModal />
      {/* Aqui y no en (main): la portada cuelga de app/page.js, fuera de ese
          grupo, de modo que en la tienda no habia contenedor y ningun aviso
          llegaba a pintarse. El de bienvenida se lanzaba y se perdia, y por eso
          entrar como comprador no daba ninguna señal.

          pauseOnFocusLoss desactivado a proposito: con el valor por defecto,
          salir de la pestana congela el temporizador y los avisos se quedan en
          pantalla indefinidamente, incluso sobre una sesion ya iniciada. */}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        pauseOnFocusLoss={false}
        closeOnClick
        newestOnTop
      />
    </Provider>
  );
}

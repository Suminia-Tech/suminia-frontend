'use client';

import type { DatatableParams } from '@/shared/api/types';
import { useAppSelector } from '@/store/hooks';

import {
  useGetProductQuery,
  useGetProductsQuery,
  useGetPublicProductQuery,
  useGetPublicProductsQuery,
} from '../api/productsApi';

/* La tienda la ve todo el mundo, pero no todos ven lo mismo.

   Hay dos endpoints a proposito: `/public/products` no lleva guardas y nunca
   manda precios, y `/products` exige sesion y los manda si la empresa esta
   aprobada. Separarlos es lo que hace que la superficie publica sea una lista
   corta y auditable en vez de depender de que a un endpoint no le falte un
   decorador.

   El precio de esa separacion es que la pantalla tendria que saber a cual
   llamar. Eso vive aqui, en un sitio, y no repetido en la portada, el catalogo
   y la ficha.

   Se salta la consulta que no toca en lugar de lanzar las dos: RTK Query
   descarta la respuesta de la saltada, pero la peticion se habria hecho igual.

   Hasta que la sesion se lee de localStorage no se sabe quien mira, de modo que
   se espera a `hydrated` antes de decidir. Sin esa espera, un comprador
   aprobado veria un parpadeo sin precios al cargar. */
const useSession = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return { hydrated, conSesion: hydrated && isAuthenticated };
};

export const useCatalogProducts = (params: DatatableParams) => {
  const { hydrated, conSesion } = useSession();

  const publico = useGetPublicProductsQuery(params, {
    skip: !hydrated || conSesion,
  });
  const privado = useGetProductsQuery(params, {
    skip: !conSesion,
  });

  const query = conSesion ? privado : publico;

  return {
    ...query,
    /* Mientras no se sepa si hay sesion no se ha pedido nada todavia, y sin
       esto la pantalla pintaria su estado vacio por un instante. */
    isLoading: !hydrated || query.isLoading,
  };
};

export const useCatalogProduct = (id: string) => {
  const { hydrated, conSesion } = useSession();

  const publico = useGetPublicProductQuery(id, { skip: !hydrated || conSesion });
  const privado = useGetProductQuery(id, { skip: !conSesion });

  const query = conSesion ? privado : publico;

  return { ...query, isLoading: !hydrated || query.isLoading };
};

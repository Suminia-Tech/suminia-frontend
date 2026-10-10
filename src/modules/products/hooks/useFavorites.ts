'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useGetFavoritesQuery, useSetFavoriteMutation } from '../api/productsApi';

/* Quien puede guardar favoritos: un comprador con sesion. La lista vive en su
   cuenta (/buyer/account/favorites), de modo que al proveedor o al personal de
   Suminia el corazon no les llevaria a ningun sitio.

   El rol se lee de la sesion y no del modulo auth, que products no puede
   importar. Es la misma regla que alli: los roles de comprador empiezan por
   "buyer_". */
const useIsBuyer = (): boolean => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const user = useAppSelector((state) => state.auth.user);
  if (!hydrated || !user) return false;

  return (user.roles ?? []).some((role) => {
    const name = typeof role === 'string' ? role : role?.name;
    return Boolean(name?.startsWith('buyer_'));
  });
};

/* Si un producto tiene el corazon puesto y como cambiarlo. El cambio se ve en
   cuanto se pulsa —lo guarda `pendiente`— y se deshace si el servidor falla. */
export const useFavorite = (productId: string) => {
  const isBuyer = useIsBuyer();
  const { data } = useGetFavoritesQuery(undefined, { skip: !isBuyer });
  const [setFavorite, { isLoading }] = useSetFavoriteMutation();
  const [pendiente, setPendiente] = useState<boolean | null>(null);

  const guardado = data?.data.some((product) => product.id === productId) ?? false;
  const isFavorite = pendiente ?? guardado;

  const toggle = async () => {
    const siguiente = !isFavorite;
    setPendiente(siguiente);
    try {
      await setFavorite({ productId, favorite: siguiente }).unwrap();
      toast.success(siguiente ? 'Guardado en tus favoritos' : 'Quitado de tus favoritos');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo actualizar tus favoritos.'));
    } finally {
      setPendiente(null);
    }
  };

  return { canFavorite: isBuyer, isFavorite, toggle, isLoading };
};

export { useIsBuyer };

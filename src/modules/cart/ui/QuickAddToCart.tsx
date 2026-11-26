'use client';

import { useState, type MouseEvent } from 'react';
import { Check, ShoppingCart } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useAddCartItemMutation } from '../api/cartApi';
import { useCanBuy } from '../hooks/useCanBuy';
import { initialQuantity } from '../lib/quantity';
import type { BuyableFormat } from './BuyBox';

/* Agregar al carrito desde la lista de productos, sin entrar a la ficha.

   Agrega la presentacion que la tarjeta muestra —la principal, o la mas
   barata—, en la cantidad minima que admite el proveedor. Para elegir otra
   presentacion o la cantidad esta la ficha: aqui es el atajo de quien ya sabe
   lo que compra.

   Solo para quien puede comprar, y solo si hay precio y existencias: un boton
   que va a responder que no se puede no se ofrece. Va fuera del enlace de la
   tarjeta —un boton dentro de un enlace no es HTML valido— y el clic no
   navega. */
export const QuickAddToCart = ({
  productName,
  formats,
}: {
  productName: string;
  formats: BuyableFormat[];
}) => {
  const { canBuy, hydrated } = useCanBuy();
  const [addItem, { isLoading }] = useAddCartItemMutation();
  /* Un momento despues de agregar, el boton se pone verde con un chulo: el
     aviso solo no hacia sentir que el producto habia entrado al carrito. */
  const [agregado, setAgregado] = useState(false);
  const formato = formats[0];

  if (!hydrated || !canBuy || !formato || formato.price === null || formato.stock <= 0) {
    return null;
  }

  const cantidad = initialQuantity(formato);

  const agregar = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await addItem({ presentationId: formato.presentationId, quantity: cantidad }).unwrap();
      setAgregado(true);
      window.setTimeout(() => setAgregado(false), 1500);
      toast.success(
        `${cantidad > 1 ? `${cantidad} × ` : ''}${productName} ${formato.name} añadido a tu carrito`,
      );
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo añadir al carrito.'));
    }
  };

  return (
    <button
      type='button'
      className={`catalog-card-add${agregado ? ' is-added' : ''}${isLoading ? ' is-busy' : ''}`}
      disabled={isLoading}
      aria-label={`Agregar ${productName} al carrito`}
      title='Agregar al carrito'
      onClick={(event) => void agregar(event)}
    >
      {agregado ? <Check size={18} /> : <ShoppingCart size={17} />}
    </button>
  );
};

export default QuickAddToCart;

'use client';

import Link from 'next/link';
import { ShoppingCart } from 'react-feather';

import { useGetCartQuery } from '../api/cartApi';
import { useCanBuy } from '../hooks/useCanBuy';

/* El carrito de la cabecera.

   Sustituye al de la plantilla, que leia ids de `localStorage` contra un JSON
   estatico y enseñaba $0.00 a todo el mundo, incluso sin sesion.

   A quien no puede comprar no se le enseña un carrito vacio sino nada: un
   visitante no tiene donde meter productos, y un carrito a cero solo ocupa
   sitio y promete algo que no existe todavia. */
export const CartWidget = () => {
  const { canBuy, hydrated } = useCanBuy();
  const { data } = useGetCartQuery(undefined, { skip: !hydrated || !canBuy });

  if (!hydrated || !canBuy) return null;

  const cart = data?.data;
  const total = cart
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: cart.currency,
        maximumFractionDigits: 0,
      }).format(cart.total)
    : '—';

  return (
    <li className='onhover-dropdown cart-dropdown'>
      <Link href='/cart' className='btn btn-solid-default btn-spacing'>
        <ShoppingCart className='pe-sm-2' />
        <span>{total}</span>
        {Boolean(cart?.itemCount) && (
          <span className='cart-badge'>{cart?.itemCount}</span>
        )}
      </Link>
    </li>
  );
};

export default CartWidget;

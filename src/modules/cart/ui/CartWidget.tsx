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
   sitio y promete algo que no existe todavia.

   Sin el total. Lo llevaba la plantilla —$0.00 pintado en la cabecera— y no lo
   hace ningun marketplace: lo que se consulta de un vistazo es cuantas cosas
   hay, no cuanto suman. El precio ademas crece con el pedido y descuadra la
   fila entera. */
export const CartWidget = () => {
  const { canBuy, hydrated } = useCanBuy();
  const { data } = useGetCartQuery(undefined, { skip: !hydrated || !canBuy });

  if (!hydrated || !canBuy) return null;

  const cuantos = data?.data.itemCount ?? 0;

  return (
    <li className='onhover-dropdown cart-dropdown'>
      <Link
        href='/cart'
        className='btn btn-solid-default btn-spacing'
        aria-label={
          cuantos === 0
            ? 'Mi carrito, vacío'
            : `Mi carrito, ${cuantos} ${cuantos === 1 ? 'producto' : 'productos'}`
        }
      >
        <ShoppingCart />
      </Link>
      {/* Fuera del boton y no dentro: `.btn` recorta con `overflow: hidden`, de
          modo que ahi dentro la esquina redondeada se come el numero.
          `aria-hidden` porque la cuenta ya va dicha en el `aria-label`. */}
      {cuantos > 0 && (
        <span className='cart-badge' aria-hidden='true'>
          {cuantos}
        </span>
      )}
    </li>
  );
};

export default CartWidget;

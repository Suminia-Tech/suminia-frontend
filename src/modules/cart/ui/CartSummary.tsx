'use client';

import { AlertCircle } from 'react-feather';

import { useGetCartQuery } from '../api/cartApi';
import { useCanBuy } from '../hooks/useCanBuy';

/* Lo que se va a pedir, de solo lectura.

   Es el carrito sin botones: quien llega a confirmar ya decidio, y dejarle
   cambiar cantidades aqui solo invita a dar vueltas. Para eso esta el carrito,
   a un clic. */

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

export const CartSummary = () => {
  const { canBuy, hydrated } = useCanBuy();
  const { data, isLoading } = useGetCartQuery(undefined, {
    skip: !hydrated || !canBuy,
  });

  if (!hydrated || isLoading) return <p className='font-light'>Cargando...</p>;

  const cart = data?.data;
  if (!cart || cart.itemCount === 0) {
    return <p className='font-light'>Tu carrito está vacío.</p>;
  }

  return (
    <div className='checkout-summary'>
      {cart.groups.map((group) => (
        <div className='checkout-group' key={group.organizationId}>
          <div className='checkout-group-head'>
            <h4>{group.organizationName}</h4>
            <strong>{pesos(group.subtotal, cart.currency)}</strong>
          </div>

          <ul className='checkout-lines'>
            {group.items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.quantity} × {item.productName}
                  <small className='font-light'>
                    {' '}
                    · {item.presentationName}
                  </small>
                </span>
                <span>{pesos(item.subtotal, cart.currency)}</span>
              </li>
            ))}
          </ul>

          {!group.meetsMinimum && group.minOrderValue !== null && (
            <p className='cart-group-min'>
              <AlertCircle size={15} />
              Este proveedor despacha desde{' '}
              {pesos(group.minOrderValue, cart.currency)}. Te faltan{' '}
              <strong>
                {pesos(group.minOrderValue - group.subtotal, cart.currency)}
              </strong>
              .
            </p>
          )}
        </div>
      ))}

      <ul className='cart-summary-lines'>
        <li>
          <span className='font-light'>Subtotal</span>
          <span>{pesos(cart.subtotal, cart.currency)}</span>
        </li>
        <li>
          <span className='font-light'>IVA</span>
          <span>{pesos(cart.tax, cart.currency)}</span>
        </li>
        <li className='cart-summary-total'>
          <span>Total</span>
          <strong>{pesos(cart.total, cart.currency)}</strong>
        </li>
      </ul>
    </div>
  );
};

export default CartSummary;

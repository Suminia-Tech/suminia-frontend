'use client';

import Link from 'next/link';
import { AlertCircle, Image as ImageIcon, Trash2 } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';

import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '../api/cartApi';
import { useCanBuy } from '../hooks/useCanBuy';
import type { CartItem } from '../model/cart.types';
import QuantityStepper from './QuantityStepper';

/* El carrito entero, agrupado por proveedor.

   Los grupos no son una decoracion: cada proveedor despacha y factura por su
   cuenta, de modo que este carrito son tantos pedidos como bloques se vean.
   Decirlo aqui y no al confirmar evita la sorpresa de creer que se estaba
   haciendo uno solo.

   Ninguna cifra se suma en el navegador. Los subtotales, el IVA y los totales
   vienen del backend ya calculados: el numero que se enseña tiene que ser el
   que se va a cobrar, y dos sitios sumando por separado acaban discrepando. */

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

const CartLine = ({
  item,
  disabled,
  onQuantity,
  onRemove,
}: {
  item: CartItem;
  disabled: boolean;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}) => {
  const conDescuento = item.unitPrice < item.basePrice;

  return (
    <li className='cart-line'>
      <div className='cart-line-image'>
        {item.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element -- las imagenes
             viven en S3 y next/image exigiria declarar el dominio del bucket. */
          <img src={item.imageUrl} alt={item.productName} />
        ) : (
          <ImageIcon size={22} />
        )}
      </div>

      <div className='cart-line-name'>
        <Link href={`/catalog/${item.productId}`}>{item.productName}</Link>
        <small className='font-light'>
          {item.presentationName} · {item.packaging}
        </small>
      </div>

      <div className='cart-line-unit'>
        {pesos(item.unitPrice, item.currency)}
        <small className='font-light'>c/u</small>
        {conDescuento && (
          <small className='cart-line-tier'>
            por volumen, antes {pesos(item.basePrice, item.currency)}
          </small>
        )}
      </div>

      <div className='cart-line-qty'>
        <QuantityStepper
          value={item.quantity}
          rules={item}
          disabled={disabled}
          onChange={onQuantity}
          label={item.productName}
        />
      </div>

      <div className='cart-line-total'>{pesos(item.subtotal, item.currency)}</div>

      <button
        type='button'
        className='cart-line-remove'
        aria-label={`Quitar ${item.productName}`}
        disabled={disabled}
        onClick={onRemove}
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
};

export const CartScreen = () => {
  const { canBuy, hydrated, reason } = useCanBuy();
  const { data, isLoading, isError, error } = useGetCartQuery(undefined, {
    skip: !hydrated || !canBuy,
  });

  const [updateItem, updateState] = useUpdateCartItemMutation();
  const [removeItem, removeState] = useRemoveCartItemMutation();
  const [clearCart, clearState] = useClearCartMutation();

  const ocupado =
    updateState.isLoading || removeState.isLoading || clearState.isLoading;

  const ejecuta = async (accion: () => Promise<unknown>, fallo: string) => {
    try {
      await accion();
    } catch (err) {
      toast.error(extractErrorMessage(err, fallo));
    }
  };

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  /* Quien no puede comprar no tiene carrito. No es un error: es que todavia no
     le toca, y cada motivo se cuenta distinto. Decirle "registra tu empresa" a
     quien ya la registro y esta esperando respuesta suena a que su solicitud se
     perdio. */
  if (!canBuy) {
    if (reason === 'pending') {
      return (
        <div className='alert alert-warning'>
          Tu empresa todavía está en revisión. En cuanto quede aprobada verás los
          precios y podrás armar tu pedido.{' '}
          <Link href='/buyer/account/company'>Ver el estado de tu solicitud</Link>
          .
        </div>
      );
    }

    if (reason === 'no-organization') {
      return (
        <div className='alert alert-secondary'>
          Tu cuenta no pertenece a ninguna empresa compradora, de modo que no
          tiene carrito.
        </div>
      );
    }

    return (
      <div className='alert alert-secondary'>
        El carrito es para empresas registradas y aprobadas.{' '}
        <Link href='/register'>Registra la tuya</Link> para comprar en Suminia.
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar tu carrito.')}
      </div>
    );
  }

  const cart = data.data;

  if (cart.itemCount === 0) {
    return (
      <div className='cart-empty'>
        <p className='font-light'>Tu carrito está vacío.</p>
        <Link href='/catalog' className='btn btn-primary rounded-1'>
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className='cart-layout'>
      <div className='cart-groups'>
        {cart.groups.map((group) => (
          <section className='cart-group' key={group.organizationId}>
            <header className='cart-group-head'>
              <h3>{group.organizationName}</h3>
              <span className='font-light'>
                {group.items.length}{' '}
                {group.items.length === 1 ? 'producto' : 'productos'}
              </span>
            </header>

            <ul className='cart-lines'>
              {group.items.map((item) => (
                <CartLine
                  key={item.id}
                  item={item}
                  disabled={ocupado}
                  onQuantity={(quantity) =>
                    ejecuta(
                      () => updateItem({ id: item.id, quantity }).unwrap(),
                      'No se pudo cambiar la cantidad.',
                    )
                  }
                  onRemove={() =>
                    ejecuta(
                      () => removeItem(item.id).unwrap(),
                      'No se pudo quitar el producto.',
                    )
                  }
                />
              ))}
            </ul>

            {/* El minimo del proveedor se avisa en su grupo y no al final:
                es lo que le falta a ese pedido, no al carrito entero, y
                enterarse al confirmar obliga a volver atras. */}
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

            <footer className='cart-group-foot'>
              <span className='font-light'>Subtotal {group.organizationName}</span>
              <strong>{pesos(group.subtotal, cart.currency)}</strong>
            </footer>
          </section>
        ))}
      </div>

      <aside className='cart-summary'>
        <div className='box-head'>
          <h3>Resumen</h3>
        </div>

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

        {cart.groups.some((group) => !group.meetsMinimum) && (
          <p className='cart-summary-warn'>
            <AlertCircle size={14} />
            Algún proveedor no llega a su pedido mínimo.
          </p>
        )}

        {cart.groups.length > 1 && (
          <p className='cart-summary-note font-light'>
            Tu carrito tiene {cart.groups.length} proveedores: al confirmar se
            convierte en {cart.groups.length} pedidos, uno para cada uno.
          </p>
        )}

        <button
          type='button'
          className='btn btn-outline-danger btn-sm btn-full'
          disabled={ocupado}
          onClick={() =>
            ejecuta(() => clearCart().unwrap(), 'No se pudo vaciar el carrito.')
          }
        >
          Vaciar carrito
        </button>
      </aside>
    </div>
  );
};

export default CartScreen;

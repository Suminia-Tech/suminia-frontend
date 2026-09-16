'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useAddCartItemMutation } from '../api/cartApi';
import { useCanBuy } from '../hooks/useCanBuy';
import {
  initialQuantity,
  nextTier,
  quantityError,
  resolveUnitPrice,
  type PriceTier,
} from '../lib/quantity';
import QuantityStepper from './QuantityStepper';

/* Comprar un producto: elegir formato, cantidad, y al carrito.

   La forma la piden los datos. En B2B no se compra "un producto" sino un
   formato concreto —la caja de 50, el galon— porque el precio, las existencias
   y las reglas de despacho son de cada uno. De ahi que lo primero sea elegirlo.

   El precio se recalcula mientras se sube la cantidad, con los escalones por
   volumen del proveedor. Enseñar a cuanto falta el siguiente es la unica forma
   de que el descuento por cantidad sirva de algo: si no se ve, nadie pide mas.

   Solo aparece para quien puede comprar. A un visitante el catalogo ya le
   explica que los precios son para empresas aprobadas, y a una empresa en
   revision se lo dice la franja de su cuenta. */

export interface BuyableFormat {
  presentationId: string;
  name: string;
  packaging: string;
  price: number | null;
  currency: string;
  minOrderQuantity: number;
  orderMultiple: number;
  stock: number;
  priceTiers: PriceTier[];
}

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

export const BuyBox = ({ formats }: { formats: BuyableFormat[] }) => {
  const { canBuy, hydrated } = useCanBuy();
  const [addItem, { isLoading }] = useAddCartItemMutation();

  const disponibles = formats.filter((f) => f.price !== null && f.stock > 0);
  const [elegido, setElegido] = useState(
    () => disponibles[0]?.presentationId ?? '',
  );
  const formato =
    disponibles.find((f) => f.presentationId === elegido) ?? disponibles[0];

  const [cantidad, setCantidad] = useState(() =>
    formato ? initialQuantity(formato) : 1,
  );

  if (!hydrated || !canBuy) return null;

  if (!formato) {
    return (
      <div className='buy-box'>
        <p className='font-light mb-0'>
          Ningún formato de este producto está disponible ahora mismo.
        </p>
      </div>
    );
  }

  const cambiarFormato = (presentationId: string) => {
    const siguiente = disponibles.find(
      (f) => f.presentationId === presentationId,
    );
    if (!siguiente) return;

    setElegido(presentationId);
    /* Las reglas son de cada formato: la cantidad del anterior puede no existir
       en el nuevo. */
    setCantidad(initialQuantity(siguiente));
  };

  const error = quantityError(cantidad, formato);
  const unitario = resolveUnitPrice(
    formato.price as number,
    formato.priceTiers,
    cantidad,
  );
  const siguienteEscalon = nextTier(formato.priceTiers, cantidad);
  const conDescuento = unitario < (formato.price as number);

  const añadir = async () => {
    if (error) return;

    try {
      await addItem({
        presentationId: formato.presentationId,
        quantity: cantidad,
      }).unwrap();
      toast.success(`${cantidad} × ${formato.name} en tu carrito`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo añadir al carrito.'));
    }
  };

  return (
    <div className='buy-box'>
      {disponibles.length > 1 && (
        <label className='buy-box-field'>
          <span className='form-label'>Formato</span>
          <select
            className='form-control'
            value={formato.presentationId}
            onChange={(event) => cambiarFormato(event.target.value)}
          >
            {disponibles.map((f) => (
              <option key={f.presentationId} value={f.presentationId}>
                {f.name} · {f.packaging} · {pesos(f.price as number, f.currency)}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className='buy-box-field'>
        <span className='form-label'>Cantidad</span>
        <QuantityStepper
          value={cantidad}
          rules={formato}
          disabled={isLoading}
          onChange={setCantidad}
          label={formato.name}
        />
        <small className='font-light'>
          {formato.minOrderQuantity > 1 && `Mínimo ${formato.minOrderQuantity} · `}
          {formato.orderMultiple > 1 &&
            `de ${formato.orderMultiple} en ${formato.orderMultiple} · `}
          {formato.stock} disponibles
        </small>
        {error && <small className='text-danger d-block'>{error}</small>}
      </div>

      <div className='buy-box-total'>
        <span className='font-light'>
          {pesos(unitario, formato.currency)} c/u
          {conDescuento && (
            <s className='buy-box-base'>
              {pesos(formato.price as number, formato.currency)}
            </s>
          )}
        </span>
        <strong>{pesos(unitario * cantidad, formato.currency)}</strong>
      </div>

      {siguienteEscalon && (
        <p className='buy-box-tier'>
          Desde {siguienteEscalon.minQuantity} unidades,{' '}
          {pesos(siguienteEscalon.price, formato.currency)} c/u
        </p>
      )}

      <button
        type='button'
        className='btn btn-primary btn-full'
        disabled={isLoading || Boolean(error)}
        onClick={añadir}
      >
        <ShoppingCart size={17} className='me-2' />
        {isLoading ? 'Añadiendo...' : 'Añadir al carrito'}
      </button>

      <Link href='/cart' className='buy-box-link font-light'>
        Ver mi carrito
      </Link>
    </div>
  );
};

export default BuyBox;

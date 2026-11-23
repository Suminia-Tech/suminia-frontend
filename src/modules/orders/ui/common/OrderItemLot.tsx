'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';

import { useGetLotRulesQuery, useSetOrderItemLotMutation } from '../../api/ordersApi';
import { mesesExigidos, minimaFechaDeVencimiento } from '../../lib/lotRules';
import type { OrderItem } from '../../model/order.types';

/* Si un producto del pedido sale con lote y, si sale, cual y cuando vence.

   El proveedor responde producto por producto, en cada orden, antes de
   despachar: "tiene lote", con su numero y vencimiento, o "no tiene lote".
   No hay respuesta en blanco, porque un lote vacio no distingue entre "no
   lleva" —una camilla— y "se me olvido". Sin respuesta en todos, el
   despacho no sale.

   Bajo el nombre va lo respondido y un enlace; el enlace despliega los
   campos en una fila propia debajo del producto, a todo el ancho de la
   tabla. Los tres lados ven lo que quedo dicho. */

type Lote = Pick<OrderItem, 'id' | 'hasLot' | 'lotNumber' | 'expiresAt'>;

/* Lo respondido y el enlace que despliega los campos, bajo el nombre. */
export const OrderItemLotInfo = ({
  item,
  editable,
  open,
  onToggle,
}: {
  item: Lote;
  editable: boolean;
  open: boolean;
  onToggle: () => void;
}) => {
  const texto =
    item.hasLot === true
      ? [
          item.lotNumber && `Lote ${item.lotNumber}`,
          item.expiresAt && `Vence ${formatDay(item.expiresAt)}`,
        ]
          .filter(Boolean)
          .join(' · ')
      : item.hasLot === false
        ? 'Sin lote'
        : null;

  return (
    <>
      {texto && <small className='font-light'>{texto}</small>}
      {editable && (
        <button
          type='button'
          className='btn btn-link p-0 order-item-lot-toggle'
          aria-expanded={open}
          onClick={onToggle}
        >
          {item.hasLot === null ? 'Indicar lote' : 'Editar lote'}
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}
    </>
  );
};

/* La respuesta, en la fila que se despliega debajo del producto. Se guarda
   sola, sin boton: "No tiene lote" al marcarlo, y "Tiene lote" cuando ya
   estan el numero y el vencimiento —al salir del campo del lote o al elegir
   la fecha—. Lo guardado aparece de una vez bajo el nombre del producto.
   La fila no se cierra sola al guardar: se cierra con el mismo enlace o al
   abrir otro producto.

   La fecha se valida ahi mismo, al elegirla: el calendario deja escoger
   cualquiera, y si no cumple la vigencia minima que fija Suminia el error
   sale debajo del campo, con la fecha desde la que se acepta, y no se
   guarda. Bloquear las fechas en el calendario no explicaba por que. Antes solo lo decia el
   servidor, en un aviso que se iba, y se descubria despues de llenar todos
   los productos. Lo escrito no se borra nunca: si algo falla, queda en el
   campo para corregirlo. */
export const OrderItemLotForm = ({
  orderId,
  item,
}: {
  orderId: string;
  item: Lote;
}) => {
  const [tiene, setTiene] = useState<boolean | null>(item.hasLot);
  const [lote, setLote] = useState(item.lotNumber ?? '');
  const [vence, setVence] = useState(item.expiresAt?.slice(0, 10) ?? '');
  const [error, setError] = useState<string | null>(null);
  const [guardar] = useSetOrderItemLotMutation();
  const { data: reglas } = useGetLotRulesQuery();

  const meses = reglas?.data.minShelfLifeMonths ?? 0;
  const minima = minimaFechaDeVencimiento(meses);
  const exigido = mesesExigidos(meses);

  const fechaInvalida = (fecha: string): string | null => {
    if (!fecha || fecha >= minima) return null;
    return meses > 0
      ? `La vigencia mínima del lote es de ${exigido}: la fecha de vencimiento debe ser igual o posterior al ${formatDay(minima)}.`
      : 'El producto está vencido.';
  };

  const enviar = async (datos: { hasLot: boolean; lotNumber?: string; expiresAt?: string }) => {
    try {
      /* El exito no borra el error: si mientras se guardaba se escribio una
         fecha que no cumple, ese error es el que vale. Cada intento limpia el
         suyo antes de enviar. */
      await guardar({ id: orderId, itemId: item.id, ...datos }).unwrap();
      return true;
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo guardar el lote.'));
      return false;
    }
  };

  /* Con lote, se guarda cuando estan los dos datos, la fecha es valida y
     cambio alguno. */
  const guardarLote = (numero: string, fecha: string) => {
    const limpio = numero.trim();
    const invalida = fechaInvalida(fecha);
    setError(invalida);
    if (!limpio || !fecha || invalida) return;
    if (item.hasLot === true && limpio === item.lotNumber && fecha === item.expiresAt?.slice(0, 10)) {
      return;
    }
    void enviar({ hasLot: true, lotNumber: limpio, expiresAt: fecha });
  };

  const elegir = async (valor: boolean) => {
    setTiene(valor);
    setError(null);
    /* Si el servidor lo rechaza, la marca vuelve a como estaba. */
    if (!valor && !(await enviar({ hasLot: false }))) setTiene(item.hasLot);
  };

  return (
    <div className='order-item-lot-form'>
      <div className='order-item-lot-choice' role='radiogroup' aria-label='¿Tiene lote?'>
        {(
          [
            { value: true, label: 'Tiene lote' },
            { value: false, label: 'No tiene lote' },
          ] as const
        ).map((opcion) => (
          <div className='form-check' key={String(opcion.value)}>
            <input
              id={`tiene-lote-${item.id}-${opcion.value}`}
              type='radio'
              name={`tiene-lote-${item.id}`}
              className='form-check-input'
              checked={tiene === opcion.value}
              onChange={() => void elegir(opcion.value)}
            />
            <label className='form-check-label' htmlFor={`tiene-lote-${item.id}-${opcion.value}`}>
              {opcion.label}
            </label>
          </div>
        ))}
      </div>

      {tiene && (
        <div className='order-item-lot-fields'>
          <div>
            <label className='form-label' htmlFor={`lote-${item.id}`}>
              Lote
            </label>
            <input
              id={`lote-${item.id}`}
              type='text'
              className='form-control'
              maxLength={60}
              placeholder='Ej. L240915'
              value={lote}
              onChange={(event) => setLote(event.target.value)}
              onBlur={() => guardarLote(lote, vence)}
            />
          </div>
          <div>
            <label className='form-label' htmlFor={`vence-${item.id}`}>
              Fecha de vencimiento
            </label>
            <input
              id={`vence-${item.id}`}
              type='date'
              className={`form-control${error ? ' is-invalid' : ''}`}
              value={vence}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `vence-error-${item.id}` : undefined}
              onChange={(event) => {
                setVence(event.target.value);
                guardarLote(lote, event.target.value);
              }}
            />
          </div>
          {error && (
            <small id={`vence-error-${item.id}`} className='text-danger order-item-lot-error'>
              {error}
            </small>
          )}
        </div>
      )}
      {!tiene && error && <small className='text-danger order-item-lot-error'>{error}</small>}
    </div>
  );
};

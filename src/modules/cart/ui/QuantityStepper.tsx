'use client';

import { Minus, Plus } from 'react-feather';

import {
  initialQuantity,
  stepDown,
  stepUp,
  type PurchaseRules,
} from '../lib/quantity';

/* El selector de cantidad de un formato.

   Los botones se mueven de multiplo en multiplo y no de uno en uno: si el
   proveedor despacha de 5 en 5, las cantidades intermedias no existen y
   ofrecerlas solo lleva a un error. El campo se deja escribir a mano —pedir 240
   a base de pulsaciones seria absurdo— y ahi si puede quedar un numero
   invalido, que es lo que avisa `quantityError`. */

interface QuantityStepperProps {
  value: number;
  rules: PurchaseRules;
  disabled?: boolean;
  onChange: (quantity: number) => void;
  /** Para que el lector de pantalla sepa de que formato es este selector. */
  label: string;
}

export const QuantityStepper = ({
  value,
  rules,
  disabled,
  onChange,
  label,
}: QuantityStepperProps) => {
  const minimo = initialQuantity(rules);

  return (
    <div className='cart-stepper'>
      <button
        type='button'
        aria-label={`Quitar ${rules.orderMultiple} de ${label}`}
        disabled={disabled || value <= minimo}
        onClick={() => onChange(stepDown(value, rules))}
      >
        <Minus size={14} />
      </button>
      <input
        type='number'
        className='form-control'
        aria-label={`Cantidad de ${label}`}
        value={value}
        min={minimo}
        step={rules.orderMultiple}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <button
        type='button'
        aria-label={`Añadir ${rules.orderMultiple} de ${label}`}
        disabled={disabled || value + rules.orderMultiple > rules.stock}
        onClick={() => onChange(stepUp(value, rules))}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantityStepper;

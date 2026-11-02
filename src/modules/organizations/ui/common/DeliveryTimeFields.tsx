'use client';

import { Plus, X } from 'react-feather';

import {
  DELIVERY_KIND_OPTIONS,
  emptyDelivery,
  toDeliveryDays,
  toDeliveryValues,
  type DeliveryKind,
  type DeliveryValues,
} from '../../lib/deliveryTime';
import type { SupplierDeliveryTime } from '../../model/organization.types';

interface DeliveryTimeInputProps {
  id: string;
  value: DeliveryValues;
  onChange: (value: DeliveryValues) => void;
}

/* La forma del tiempo y, segun ella, uno o dos numeros. */
export const DeliveryTimeInput = ({
  id,
  value,
  onChange,
}: DeliveryTimeInputProps) => {
  const set = (patch: Partial<DeliveryValues>) => onChange({ ...value, ...patch });

  return (
    <div className='delivery-days'>
      <select
        id={id}
        className='form-control delivery-kind'
        aria-label='Forma del tiempo de entrega'
        value={value.kind}
        onChange={(event) => set({ kind: event.target.value as DeliveryKind | '' })}
      >
        {/* Solo mientras no ha elegido, y sin poder volver a ella: no es una
            respuesta, es el hueco antes de darla. */}
        {value.kind === '' && (
          <option value='' disabled>
            Elige una opción
          </option>
        )}
        {DELIVERY_KIND_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {(value.kind === 'fixed' || value.kind === 'range') && (
        <input
          type='number'
          min={value.kind === 'fixed' ? 1 : 0}
          max={90}
          className='form-control'
          aria-label={value.kind === 'fixed' ? 'Días hábiles' : 'Días hábiles, desde'}
          placeholder={value.kind === 'fixed' ? '3' : '2'}
          value={value.min}
          onChange={(event) => set({ min: event.target.value })}
        />
      )}
      {value.kind === 'range' && (
        <>
          <span className='font-light'>a</span>
          <input
            type='number'
            min={1}
            max={90}
            className='form-control'
            aria-label='Días hábiles, hasta'
            placeholder='5'
            value={value.max}
            onChange={(event) => set({ max: event.target.value })}
          />
        </>
      )}
      {(value.kind === 'fixed' || value.kind === 'range') && (
        <span className='font-light'>días hábiles</span>
      )}
    </div>
  );
};

/* Un tiempo distinto del general en una ciudad. */
export interface CityDeliveryValues {
  city: string;
  delivery: DeliveryValues;
}

/* El tope que acepta el backend. */
export const MAX_DELIVERY_CITIES = 50;

export const toCityDeliveryValues = (
  times: SupplierDeliveryTime[] | undefined,
): CityDeliveryValues[] =>
  (times ?? []).map((time) => ({
    city: time.city,
    delivery: toDeliveryValues(time.daysMin, time.daysMax),
  }));

export const isCityDeliveryEmpty = (value: CityDeliveryValues): boolean =>
  value.city.trim() === '' && value.delivery.min === '' && value.delivery.max === '';

/* De vuelta al contrato del backend. Las filas que se añadieron y nadie lleno
   no viajan. */
export const toDeliveryTimeRows = (values: CityDeliveryValues[]): SupplierDeliveryTime[] =>
  values
    .filter((value) => !isCityDeliveryEmpty(value))
    .map((value) => {
      const { min, max } = toDeliveryDays(value.delivery);
      return { city: value.city.trim(), daysMin: min ?? 0, daysMax: max ?? 0 };
    });

interface CityDeliveryTimesFieldsProps {
  values: CityDeliveryValues[];
  /* Por indice; el formulario los calcula al guardar. */
  errors: Record<number, string>;
  onChange: (values: CityDeliveryValues[]) => void;
}

/* Las ciudades donde entrega en un tiempo distinto del general: el mismo dia
   en la suya y en cinco en la costa, por ejemplo. Empieza vacia: muchos
   proveedores tienen un solo tiempo, y una fila en blanco pareceria algo que
   falta. */
export const CityDeliveryTimesFields = ({
  values,
  errors,
  onChange,
}: CityDeliveryTimesFieldsProps) => {
  const setRow = (index: number, patch: Partial<CityDeliveryValues>) =>
    onChange(values.map((value, i) => (i === index ? { ...value, ...patch } : value)));

  return (
    <div className='delivery-cities'>
      {values.map((value, index) => (
        <div className='delivery-city' key={index}>
          <div className='delivery-city-row'>
            <input
              type='text'
              maxLength={120}
              className='form-control delivery-city-name'
              aria-label='Ciudad'
              placeholder='Ciudad'
              value={value.city}
              onChange={(event) => setRow(index, { city: event.target.value })}
            />
            <DeliveryTimeInput
              id={`entrega-ciudad-${index}`}
              value={value.delivery}
              onChange={(delivery) => setRow(index, { delivery })}
            />
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm'
              aria-label='Quitar ciudad'
              title='Quitar ciudad'
              onClick={() => onChange(values.filter((_, i) => i !== index))}
            >
              <X size={15} />
            </button>
          </div>
          {errors[index] && <small className='text-danger'>{errors[index]}</small>}
        </div>
      ))}

      {values.length < MAX_DELIVERY_CITIES && (
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm btn-with-icon'
          onClick={() =>
            onChange([...values, { city: '', delivery: { ...emptyDelivery(), kind: 'same-day' } }])
          }
        >
          <Plus size={15} /> Añadir ciudad
        </button>
      )}
    </div>
  );
};

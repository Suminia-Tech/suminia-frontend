'use client';

import { Plus, X } from 'react-feather';

import type { SupplierShippingCost } from '../../model/organization.types';

/* El costo de envio por ciudad, cuando no es el general. Las mismas filas que
   los tiempos por ciudad: un mismo control se ve igual en toda la app. */

export interface CityShippingValues {
  city: string;
  cost: string;
}

/* El tope que acepta el backend. */
export const MAX_SHIPPING_CITIES = 50;

export const toCityShippingValues = (
  rows: SupplierShippingCost[] | undefined,
): CityShippingValues[] =>
  (rows ?? []).map((row) => ({ city: row.city, cost: String(row.cost) }));

export const isCityShippingEmpty = (value: CityShippingValues): boolean =>
  value.city.trim() === '' && value.cost.trim() === '';

/* De vuelta al contrato del backend. Las filas en blanco no viajan. */
export const toShippingCostRows = (values: CityShippingValues[]): SupplierShippingCost[] =>
  values
    .filter((value) => !isCityShippingEmpty(value))
    .map((value) => ({ city: value.city.trim(), cost: Number(value.cost) }));

interface CityShippingCostsFieldsProps {
  values: CityShippingValues[];
  errors: Record<number, string>;
  onChange: (values: CityShippingValues[]) => void;
}

export const CityShippingCostsFields = ({
  values,
  errors,
  onChange,
}: CityShippingCostsFieldsProps) => {
  const setRow = (index: number, patch: Partial<CityShippingValues>) =>
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
            <input
              type='number'
              min={0}
              step={1000}
              className='form-control delivery-city-cost'
              aria-label='Costo de envío'
              placeholder='Costo con IVA'
              value={value.cost}
              onChange={(event) => setRow(index, { cost: event.target.value })}
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

      {values.length < MAX_SHIPPING_CITIES && (
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm btn-with-icon'
          onClick={() => onChange([...values, { city: '', cost: '' }])}
        >
          <Plus size={15} /> Añadir ciudad
        </button>
      )}
    </div>
  );
};

export default CityShippingCostsFields;

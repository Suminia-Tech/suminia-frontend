'use client';

import { Plus, X } from 'react-feather';

import { Panel } from '@/shared/ui';

import { SECTION } from '../../lib/pendings';
import type { SupplierWarehouse } from '../../model/organization.types';

/* Lo que se escribe de cada bodega. El id viaja de vuelta para que el backend
   actualice la misma y no cree otra; las nuevas no lo tienen. */
export interface WarehouseValues {
  id?: string;
  name: string;
  address: string;
  city: string;
}

/* El tope que acepta el backend. */
export const MAX_WAREHOUSES = 20;

const emptyWarehouse = (): WarehouseValues => ({ name: '', address: '', city: '' });

export const toWarehouseValues = (
  warehouses: SupplierWarehouse[] | undefined,
): WarehouseValues[] =>
  (warehouses ?? []).map((warehouse) => ({
    id: warehouse.id,
    name: warehouse.name ?? '',
    address: warehouse.address,
    city: warehouse.city,
  }));

export const isWarehouseEmpty = (warehouse: WarehouseValues): boolean =>
  [warehouse.name, warehouse.address, warehouse.city].every((value) => value.trim() === '');

/* De vuelta al contrato del backend. Las que quedaron en blanco no viajan:
   son las que se añadieron y nadie lleno. */
export const toWarehouseRows = (warehouses: WarehouseValues[]) =>
  warehouses
    .filter((warehouse) => !isWarehouseEmpty(warehouse))
    .map((warehouse) => ({
      ...(warehouse.id && { id: warehouse.id }),
      name: warehouse.name.trim() || null,
      address: warehouse.address.trim(),
      city: warehouse.city.trim(),
    }));

interface SupplierWarehousesFieldsProps {
  warehouses: WarehouseValues[];
  /* Por indice; el formulario los calcula al guardar. */
  errors: Record<number, string>;
  onChange: (warehouses: WarehouseValues[]) => void;
}

/* Las bodegas y puntos de inventario. Aparte de la oficina principal: la sede
   no tiene por que guardar mercancia, y una empresa puede despachar desde
   varias ciudades. Con esto Suminia sabe por donde sale cada pedido y a donde
   ir en una visita de calidad.

   No es obligatorio, de modo que empieza vacio: un hueco en blanco de entrada
   pareceria algo que falta. */
const SupplierWarehousesFields = ({
  warehouses,
  errors,
  onChange,
}: SupplierWarehousesFieldsProps) => {
  const setWarehouse = (index: number, field: keyof Omit<WarehouseValues, 'id'>, value: string) =>
    onChange(warehouses.map((w, i) => (i === index ? { ...w, [field]: value } : w)));

  return (
    <Panel
      id={SECTION.warehouses}
      title='Bodegas y puntos de inventario'
      description='Dónde guardas y desde dónde despachas la mercancía. Con esto Suminia coordina la logística de tus pedidos y programa las visitas de calidad.'
    >
      <div className='form-grid'>
        {warehouses.length === 0 && (
          <p className='font-light form-grid-full mb-0'>
            Aún no has registrado bodegas. Si despachas desde tu oficina principal, regístrala
            también aquí.
          </p>
        )}

        {warehouses.map((warehouse, index) => {
          const id = (field: string) => `bodega-${index}-${field}`;
          return (
            <fieldset className='form-grid-full contact-area' key={warehouse.id ?? `nueva-${index}`}>
              {/* Un div y no un legend: el navegador pinta el legend encima del
                  borde, y la linea entre bodegas quedaba detras del titulo. */}
              <div className='contact-area-head'>
                <span className='form-group-title'>
                  {warehouse.name.trim() || `Bodega ${index + 1}`}
                </span>
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  aria-label='Quitar bodega'
                  title='Quitar bodega'
                  onClick={() => onChange(warehouses.filter((_, i) => i !== index))}
                >
                  <X size={15} />
                </button>
              </div>
              <div className='form-grid'>
                <div className='form-grid-full'>
                  <label className='form-label' htmlFor={id('nombre')}>
                    Nombre (opcional)
                  </label>
                  <input
                    id={id('nombre')}
                    type='text'
                    maxLength={120}
                    className='form-control'
                    placeholder='Bodega Itagüí'
                    value={warehouse.name}
                    onChange={(event) => setWarehouse(index, 'name', event.target.value)}
                  />
                </div>
                <div>
                  <label className='form-label' htmlFor={id('direccion')}>
                    Dirección
                  </label>
                  <input
                    id={id('direccion')}
                    type='text'
                    maxLength={255}
                    className='form-control'
                    value={warehouse.address}
                    onChange={(event) => setWarehouse(index, 'address', event.target.value)}
                  />
                </div>
                <div>
                  <label className='form-label' htmlFor={id('ciudad')}>
                    Ciudad
                  </label>
                  <input
                    id={id('ciudad')}
                    type='text'
                    maxLength={120}
                    className='form-control'
                    value={warehouse.city}
                    onChange={(event) => setWarehouse(index, 'city', event.target.value)}
                  />
                </div>
              </div>
              {errors[index] && <small className='text-danger'>{errors[index]}</small>}
            </fieldset>
          );
        })}

        {warehouses.length < MAX_WAREHOUSES && (
          <div className='form-grid-full'>
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              onClick={() => onChange([...warehouses, emptyWarehouse()])}
            >
              <Plus size={15} /> Añadir bodega
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default SupplierWarehousesFields;

'use client';

import { Plus, X } from 'react-feather';

import { resolvePlace } from '@/shared/lib/colombia';
import { CitySelect, DepartmentSelect, Panel } from '@/shared/ui';

import { SECTION } from '../../lib/pendings';
import type { OrganizationDocument, SupplierWarehouse } from '../../model/organization.types';
import WarehouseCcaaSlot from './WarehouseCcaaSlot';

/* Lo que se escribe de cada bodega. El id viaja de vuelta para que el backend
   actualice la misma y no cree otra; las nuevas no lo tienen. */
export interface WarehouseValues {
  id?: string;
  name: string;
  address: string;
  department: string;
  city: string;
}

/* El tope que acepta el backend. */
export const MAX_WAREHOUSES = 20;

const emptyWarehouse = (): WarehouseValues => ({
  name: '',
  address: '',
  department: '',
  city: '',
});

export const toWarehouseValues = (
  warehouses: SupplierWarehouse[] | undefined,
): WarehouseValues[] =>
  (warehouses ?? []).map((warehouse) => ({
    id: warehouse.id,
    name: warehouse.name ?? '',
    address: warehouse.address,
    ...resolvePlace(warehouse.city, warehouse.department),
  }));

export const isWarehouseEmpty = (warehouse: WarehouseValues): boolean =>
  [warehouse.name, warehouse.address, warehouse.department, warehouse.city].every(
    (value) => value.trim() === '',
  );

/* De vuelta al contrato del backend. Las que quedaron en blanco no viajan:
   son las que se añadieron y nadie lleno. */
export const toWarehouseRows = (warehouses: WarehouseValues[]) =>
  warehouses
    .filter((warehouse) => !isWarehouseEmpty(warehouse))
    .map((warehouse) => ({
      ...(warehouse.id && { id: warehouse.id }),
      name: warehouse.name.trim() || null,
      address: warehouse.address.trim(),
      city: warehouse.city,
      department: warehouse.department,
    }));

interface SupplierWarehousesFieldsProps {
  warehouses: WarehouseValues[];
  /* Por indice; el formulario los calcula al guardar. */
  errors: Record<number, string>;
  onChange: (warehouses: WarehouseValues[]) => void;
  /* Para el CCAA de cada bodega, que se sube al momento como los demas
     documentos y no con "Guardar cambios". */
  organizationId: string;
  documents: OrganizationDocument[];
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
  organizationId,
  documents,
}: SupplierWarehousesFieldsProps) => {
  const setWarehouse = (index: number, field: keyof Omit<WarehouseValues, 'id'>, value: string) =>
    onChange(
      warehouses.map((w, i) => {
        if (i !== index) return w;
        /* Otro departamento deja la ciudad por elegir: la de antes no esta en
           su lista. */
        return field === 'department'
          ? { ...w, department: value, city: '' }
          : { ...w, [field]: value };
      }),
    );

  return (
    <Panel
      id={SECTION.warehouses}
      title='Bodegas y puntos de inventario'
      description='Registra los establecimientos desde los cuales almacenas y despachas tus productos. Esta información permite a Suminia coordinar las operaciones logísticas y realizar el seguimiento a las condiciones de almacenamiento y calidad.'
    >
      <div className='form-grid'>
        {warehouses.length === 0 && (
          <p className='font-light form-grid-full mb-0'>
            Aún no has registrado establecimientos. Añade las ubicaciones desde las cuales
            atenderás los pedidos de Suminia.
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
                  <label className='form-label' htmlFor={id('departamento')}>
                    Departamento
                  </label>
                  <DepartmentSelect
                    id={id('departamento')}
                    value={warehouse.department}
                    onChange={(value) => setWarehouse(index, 'department', value)}
                  />
                </div>
                <div>
                  <label className='form-label' htmlFor={id('ciudad')}>
                    Ciudad
                  </label>
                  <CitySelect
                    id={id('ciudad')}
                    department={warehouse.department}
                    value={warehouse.city}
                    onChange={(value) => setWarehouse(index, 'city', value)}
                  />
                </div>
                <div className='form-grid-full'>
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
                {/* El CCAA se asocia a una bodega guardada: en una recien
                    agregada el boton de subir queda inactivo hasta guardar. */}
                <div className='form-grid-full document-slots'>
                  <WarehouseCcaaSlot
                    organizationId={organizationId}
                    warehouseId={warehouse.id}
                    documents={documents}
                    editable
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

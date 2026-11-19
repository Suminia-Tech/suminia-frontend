'use client';

import { X } from 'react-feather';

import { ZONE_LABEL, ZONES, type Zone } from '@/shared/lib/zones';
import { CitySelect, DepartmentSelect, Panel } from '@/shared/ui';

import {
  CLIENT_TYPE_LABEL,
  EMPTY_STAFF_FILTERS,
  monthLabel,
  rangeLabel,
  UNIT_RANGES,
  VALUE_RANGES,
  type StaffOrderFilters,
} from '../../lib/staffFilters';
import type { OrderMetrics } from '../../model/order.types';

const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

interface StaffOrderFiltersPanelProps {
  filters: StaffOrderFilters;
  metrics: OrderMetrics | undefined;
  onChange: (filters: StaffOrderFilters) => void;
}

/* Los filtros y lo que suma lo filtrado. La barra es la de Mis productos
   —desplegables en pildora y los elegidos como etiquetas que se quitan de un
   clic— y las cifras, la lista del Resumen: el mismo elemento se ve igual en
   toda la app. */
export const StaffOrderFiltersPanel = ({
  filters,
  metrics,
  onChange,
}: StaffOrderFiltersPanelProps) => {
  const options = metrics?.options;
  /* Quitar el departamento se lleva la ciudad: sola no dice de donde es. */
  const set = (key: keyof StaffOrderFilters, value: string) =>
    onChange({ ...filters, [key]: value, ...(key === 'department' && !value ? { city: '' } : {}) });

  const categoryName = (id: string) =>
    options?.categories.find((category) => category.id === id)?.name ?? 'Categoría';

  const active: { key: keyof StaffOrderFilters; label: string; value: string }[] = [
    filters.month && { key: 'month', label: 'Mes', value: monthLabel(filters.month) },
    filters.categoryId && {
      key: 'categoryId',
      label: 'Categoría',
      value: categoryName(filters.categoryId),
    },
    filters.department && {
      key: 'department',
      label: 'Departamento',
      value: filters.department,
    },
    filters.city && { key: 'city', label: 'Ciudad', value: filters.city },
    filters.zone && {
      key: 'zone',
      label: 'Zona',
      value: ZONE_LABEL[filters.zone as Zone] ?? filters.zone,
    },
    filters.clientType && {
      key: 'clientType',
      label: 'Cliente',
      value: CLIENT_TYPE_LABEL[filters.clientType] ?? filters.clientType,
    },
    filters.value && {
      key: 'value',
      label: 'Valor',
      value: rangeLabel(VALUE_RANGES, filters.value),
    },
    filters.units && {
      key: 'units',
      label: 'Unidades',
      value: rangeLabel(UNIT_RANGES, filters.units),
    },
  ].filter((item): item is { key: keyof StaffOrderFilters; label: string; value: string } =>
    Boolean(item),
  );

  return (
    <>
      <div className='catalog-panel orders-staff-filters'>
        <div className='catalog-toolbar'>
          <div className='catalog-toolbar-filters'>
            <select
              className='filter-select'
              aria-label='Mes'
              value={filters.month}
              onChange={(event) => set('month', event.target.value)}
            >
              <option value=''>Todos los meses</option>
              {options?.months.map((month) => (
                <option key={month} value={month}>
                  {monthLabel(month)}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Categoría de producto'
              value={filters.categoryId}
              onChange={(event) => set('categoryId', event.target.value)}
            >
              <option value=''>Categoría</option>
              {options?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Departamento y despues ciudad, de la lista completa del DANE y
                no solo de donde ya hubo pedidos. La ciudad aparece al elegir
                el departamento: hay nombres repetidos entre departamentos, y
                sin el no se sabe de cual se habla. */}
            <DepartmentSelect
              className='filter-select'
              aria-label='Departamento de entrega'
              placeholder='Departamento'
              value={filters.department}
              onChange={(department) => onChange({ ...filters, department, city: '' })}
            />

            {filters.department && (
              <CitySelect
                className='filter-select'
                aria-label='Ciudad de entrega'
                placeholder='Ciudad'
                department={filters.department}
                value={filters.city}
                onChange={(city) => set('city', city)}
              />
            )}

            {/* La zona de la sede dentro de su ciudad. La elige el comprador en
                la sede, en las ciudades grandes. */}
            <select
              className='filter-select'
              aria-label='Zona de entrega'
              value={filters.zone}
              onChange={(event) => set('zone', event.target.value)}
            >
              <option value=''>Zona</option>
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {ZONE_LABEL[zone]}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Tipo de cliente'
              value={filters.clientType}
              onChange={(event) => set('clientType', event.target.value)}
            >
              <option value=''>Tipo de cliente</option>
              {/* Todos los tipos de comprador, y no solo los que ya tienen
                  pedidos: con pocos datos el desplegable salia vacio. */}
              {Object.entries(CLIENT_TYPE_LABEL).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Valor del pedido'
              value={filters.value}
              onChange={(event) => set('value', event.target.value)}
            >
              <option value=''>Valor</option>
              {VALUE_RANGES.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Unidades del pedido'
              value={filters.units}
              onChange={(event) => set('units', event.target.value)}
            >
              <option value=''>Unidades</option>
              {UNIT_RANGES.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {active.length > 0 && (
          <div className='catalog-active-filters'>
            {active.map((filter) => (
              <button
                type='button'
                key={filter.key}
                className='filter-chip'
                onClick={() => set(filter.key, '')}
              >
                <span className='font-light'>{filter.label}:</span> {filter.value}
                <X size={13} />
              </button>
            ))}
            <button
              type='button'
              className='filter-clear'
              onClick={() => onChange(EMPTY_STAFF_FILTERS)}
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Lo que suma lo filtrado: las metricas basicas para evaluar la
          operacion. El dinero y las unidades, sin lo anulado ni lo rechazado. */}
      <Panel
        title={active.length > 0 ? 'Lo que muestra este filtro' : 'Todos los pedidos'}
        description='Valor, margen y unidades sin contar los pedidos anulados ni rechazados.'
      >
        <ul className='data-list'>
          <li>
            <span className='font-light'>Pedidos</span>
            <span>{metrics?.orders ?? '—'}</span>
          </li>
          <li>
            <span className='font-light'>Valor de los pedidos</span>
            <span>{metrics ? pesos(metrics.billed) : '—'}</span>
          </li>
          <li>
            <span className='font-light'>Margen de Suminia</span>
            <span>{metrics ? pesos(metrics.commission) : '—'}</span>
          </li>
          <li>
            <span className='font-light'>Unidades</span>
            <span>{metrics ? metrics.units.toLocaleString('es-CO') : '—'}</span>
          </li>
        </ul>
      </Panel>
    </>
  );
};

export default StaffOrderFiltersPanel;

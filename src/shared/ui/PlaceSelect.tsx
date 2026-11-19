'use client';

import { citiesOf, DEPARTMENTS } from '../lib/colombia';

/* El departamento y la ciudad, de la lista del DANE. Dos desplegables sueltos
   y no un componente que los pinte juntos: cada formulario los acomoda en su
   rejilla —dos celdas de una ficha, dos columnas de una fila de tabla—, y el
   estado ya vive en el formulario. Al cambiar de departamento, el formulario
   vacia la ciudad: la de antes no esta en la lista nueva.

   Desplegables nativos a proposito: con el foco puesto, escribir "Me" salta a
   Medellín, y el teclado del movil ofrece su propio buscador. */

interface PlaceSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  required?: boolean;
  /** El texto de la opcion vacia, en formularios sin etiqueta encima. */
  placeholder?: string;
  'aria-label'?: string;
}

export const DepartmentSelect = ({
  value,
  onChange,
  id,
  className = 'form-control',
  required,
  placeholder = 'Elige el departamento',
  'aria-label': ariaLabel,
}: PlaceSelectProps) => (
  <select
    id={id}
    className={className}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    required={required}
    aria-label={ariaLabel}
  >
    <option value=''>{placeholder}</option>
    {DEPARTMENTS.map((department) => (
      <option key={department} value={department}>
        {department}
      </option>
    ))}
  </select>
);

export const CitySelect = ({
  department,
  value,
  onChange,
  id,
  className = 'form-control',
  required,
  placeholder = 'Elige la ciudad',
  'aria-label': ariaLabel,
}: PlaceSelectProps & { department: string }) => (
  <select
    id={id}
    className={className}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    required={required}
    disabled={!department}
    aria-label={ariaLabel}
  >
    <option value=''>{department ? placeholder : 'Primero el departamento'}</option>
    {citiesOf(department).map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
);

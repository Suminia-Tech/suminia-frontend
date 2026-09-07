'use client';

import { useState, type ChangeEvent } from 'react';

/* Desplegable con las opciones conocidas y una salida para lo que no esta.

   Sustituye al datalist, que en la practica no se ve: el campo parece un texto
   libre cualquiera y hay que adivinar que hay sugerencias detras. Un select
   enseña lo que hay de un vistazo y resuelve el caso comun en un clic.

   La opcion "Otro" existe porque la lista no puede estar cerrada: el catalogo
   va a pedir envases y unidades que hoy no sabemos —viales, ampollas, dosis
   cuando entren los medicamentos— y una lista cerrada obligaria a tocar el
   codigo por cada uno. */

const CUSTOM = '__custom__';

/* Una opcion puede ser una cadena, cuando lo que se guarda y lo que se lee son
   lo mismo, o un par cuando no: una unidad guarda "mL" y se lee "Mililitro
   (mL)", porque el simbolo del SI no admite otra escritura pero una lista de
   simbolos sueltos se lee mal. */
export interface SelectOption {
  value: string;
  label: string;
}

const toOption = (option: string | SelectOption): SelectOption =>
  typeof option === 'string' ? { value: option, label: option } : option;

interface SelectWithCustomProps {
  options: (string | SelectOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Texto de la opcion vacia, cuando todavia no se ha elegido nada. */
  emptyLabel?: string;
  customLabel?: string;
  customPlaceholder?: string;
  id?: string;
}

const SelectWithCustom = ({
  options,
  value,
  onChange,
  emptyLabel = 'Selecciona',
  customLabel = 'Otro...',
  customPlaceholder = 'Escríbelo',
  id,
}: SelectWithCustomProps) => {
  const opciones = options.map(toOption);

  /* Un valor que no esta entre las opciones solo puede venir de que alguien lo
     escribio: se abre en modo libre para poder editarlo. Es lo que pasa al
     abrir un formato guardado con un empaque poco comun. */
  const [isCustom, setCustom] = useState(
    () => value !== '' && !opciones.some((option) => option.value === value),
  );

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;

    if (selected === CUSTOM) {
      setCustom(true);
      /* Se vacia para que el campo libre arranque limpio en vez de heredar la
         ultima opcion elegida, que casi nunca es lo que se quiere escribir. */
      onChange('');
      return;
    }

    setCustom(false);
    onChange(selected);
  };

  return (
    <>
      <select
        id={id}
        className='form-control'
        value={isCustom ? CUSTOM : value}
        onChange={handleSelect}
      >
        <option value=''>{emptyLabel}</option>
        {opciones.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
        <option value={CUSTOM}>{customLabel}</option>
      </select>

      {isCustom && (
        <input
          type='text'
          className='form-control mt-2'
          placeholder={customPlaceholder}
          value={value}
          autoFocus
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </>
  );
};

export default SelectWithCustom;

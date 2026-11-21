'use client';

import { useRef, useState } from 'react';
import { Check, Search, X } from 'react-feather';

import { useSearchCatalogMedicinesQuery } from '../../api/productsApi';
import type {
  CatalogMedicine,
  CatalogMedicineSearchResult,
} from '../../model/product.types';

/* Elegir el medicamento del maestro del INVIMA en vez de describirlo.

   Antes esto eran cinco campos de texto —principio activo, concentracion, forma
   farmaceutica, via, registro— que el proveedor rellenaba a mano. Se equivocaba,
   y sobre todo: dos proveedores del mismo medicamento escribian dos fichas
   distintas que nada relacionaba, de modo que el comprador no podia compararlas.

   Ahora escribe lo que sabe —la marca, el principio activo, el registro, el
   CUM— y elige una fila que ya existe. Es menos trabajo para el y es lo que
   pone su oferta al lado de las demas. */

/* Menos de tres letras devuelve vacio en el backend: con una o dos, cualquier
   termino saca miles de resultados y ninguno sirve. */
const MIN_TERM = 3;

/* Lo justo para que no se dispare una consulta por tecla sin que se note
   lentitud al escribir. */
const DEBOUNCE_MS = 300;

const principiosText = (medicine: {
  principiosActivos: { nombre: string; cantidad: string | null; unidad: string | null }[];
}): string =>
  medicine.principiosActivos
    .map((principio) =>
      [principio.nombre, principio.cantidad, principio.unidad].filter(Boolean).join(' '),
    )
    .join(' + ');

/* Solo la concentracion: "500 mg", o "10 mg + 40 mg" si combina principios,
   en el mismo orden que sus nombres. Vacio si el INVIMA no la declara. */
const concentracionText = (medicine: {
  principiosActivos: { cantidad: string | null; unidad: string | null }[];
}): string =>
  medicine.principiosActivos.some((principio) => principio.cantidad)
    ? medicine.principiosActivos
        .map((principio) =>
          [principio.cantidad, principio.unidad].filter(Boolean).join(' ') || '—',
        )
        .join(' + ')
    : '';

interface CatalogMedicinePickerProps {
  /** El elegido, si ya lo hay. Al editar viene del producto. */
  selected: CatalogMedicine | null;
  onSelect: (medicine: CatalogMedicineSearchResult | null) => void;
  error?: string;
}

const CatalogMedicinePicker = ({
  selected,
  onSelect,
  error,
}: CatalogMedicinePickerProps) => {
  const [term, setTerm] = useState('');
  /* El termino que de verdad consulta, retrasado. Se lleva en su propio estado
     y no en un efecto sobre `term`: un efecto que llama a setState vuelve a
     renderizar por nada y el lint del proyecto lo prohibe. */
  const [debounced, setDebounced] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isFetching } = useSearchCatalogMedicinesQuery(debounced, {
    skip: debounced.trim().length < MIN_TERM,
  });

  const results = data?.data ?? [];

  const handleTerm = (value: string) => {
    setTerm(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(value), DEBOUNCE_MS);
  };

  /* Ya elegido: se enseña la ficha en vez del buscador. Lo que importa aqui no
     es seguir buscando, es poder comprobar de un vistazo que es el correcto —el
     registro sanitario y la concentracion distinguen dos presentaciones que se
     llaman igual. */
  if (selected) {
    return (
      <div className='catalog-picked'>
        <div className='catalog-picked-body'>
          <span className='catalog-picked-badge'>
            <Check size={13} />
            Del catálogo del INVIMA
          </span>
          <h6>{selected.producto}</h6>
          {/* La concentracion con su nombre: es lo primero que se pregunta de un
              medicamento, y en una sola linea con el principio activo no se
              leia como dato propio. Viene del INVIMA, no se escribe. */}
          <dl className='catalog-picked-meta'>
            {selected.principiosActivos.length > 0 && (
              <div>
                <dt>
                  {selected.principiosActivos.length === 1
                    ? 'Principio activo'
                    : 'Principios activos'}
                </dt>
                <dd>{selected.principiosActivos.map((p) => p.nombre).join(' + ')}</dd>
              </div>
            )}
            {concentracionText(selected) && (
              <div>
                <dt>Concentración</dt>
                <dd>{concentracionText(selected)}</dd>
              </div>
            )}
            <div>
              <dt>Registro sanitario</dt>
              <dd>{selected.registroSanitario}</dd>
            </div>
            {selected.formaFarmaceutica && (
              <div>
                <dt>Forma farmacéutica</dt>
                <dd>{selected.formaFarmaceutica}</dd>
              </div>
            )}
            {selected.viasAdministracion.length > 0 && (
              <div>
                <dt>Vía de administración</dt>
                <dd>{selected.viasAdministracion.join(', ')}</dd>
              </div>
            )}
            {selected.titular && (
              <div>
                <dt>Titular</dt>
                <dd>{selected.titular}</dd>
              </div>
            )}
            {selected.atc && (
              <div>
                <dt>ATC</dt>
                <dd>
                  {selected.atc}
                  {selected.descripcionAtc ? ` · ${selected.descripcionAtc}` : ''}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <button
          type='button'
          className='catalog-picked-clear'
          onClick={() => {
            onSelect(null);
            setTerm('');
            setDebounced('');
          }}
          aria-label='Elegir otro medicamento'
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  const tooShort = term.trim().length > 0 && term.trim().length < MIN_TERM;
  const searched = debounced.trim().length >= MIN_TERM && !isFetching;

  return (
    /* `medicine-search` y no `catalog-search`: esa es la barra de busqueda de
       las listas, que pone todo en fila, y aqui el campo quedaba aplastado con
       el error y el aviso al lado como columnas. */
    <div className='medicine-search'>
      <div className='catalog-search-field'>
        <Search size={15} />
        <input
          type='text'
          className='form-control'
          placeholder='Nombre, principio activo, registro sanitario o CUM'
          value={term}
          onChange={(event) => handleTerm(event.target.value)}
        />
      </div>

      {error && <span className='field-error'>{error}</span>}

      {tooShort && (
        <p className='catalog-search-hint'>Escribe al menos {MIN_TERM} letras</p>
      )}

      {isFetching && <p className='catalog-search-hint'>Buscando…</p>}

      {/* Que pasa si no esta: el listado es el oficial del INVIMA con los
          registros vigentes, de modo que no estar suele ser registro vencido o
          un nombre escrito distinto. Se le dice que probar y a quien acudir,
          en vez de dejarlo frente a un "no hay" sin salida. */}
      {searched && results.length === 0 && (
        <div className='catalog-search-hint'>
          <p className='mb-1'>
            No encontramos ningún medicamento con registro sanitario vigente que coincida.
          </p>
          <p className='mb-0'>
            Prueba con el principio activo, el número de registro sanitario (INVIMA
            2019M-…) o el CUM. Si tu medicamento tiene registro vigente y aun así no
            aparece, escríbenos a Suminia y lo revisamos: solo se pueden publicar
            medicamentos con registro vigente en el INVIMA.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <ul className='catalog-results'>
          {results.map((medicine) => (
            <li key={medicine.id}>
              <button type='button' onClick={() => onSelect(medicine)}>
                <span className='catalog-result-name'>{medicine.producto}</span>
                <span className='catalog-result-principios'>
                  {principiosText(medicine)}
                </span>
                <span className='catalog-result-meta'>
                  {medicine.registroSanitario}
                  {medicine.formaFarmaceutica ? ` · ${medicine.formaFarmaceutica}` : ''}
                  {` · ${medicine.presentationCount} ${medicine.presentationCount === 1 ? 'presentación' : 'presentaciones'}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CatalogMedicinePicker;

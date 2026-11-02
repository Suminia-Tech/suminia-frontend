'use client';

import { useState } from 'react';
import { Plus, X } from 'react-feather';

import { Panel } from '@/shared/ui';

import { SECTION } from '../../lib/pendings';
import type { ContactArea, OrganizationContact } from '../../model/organization.types';

/* Lo que se escribe de cada persona. Todo cadena: el formulario no distingue
   "vacio" de "sin dato" hasta que se guarda.

   Una persona y no un area: Suminia pide contacto en todas las areas, y en una
   empresa pequeña la misma persona suele responder por varias. El backend
   guarda una fila por area; aqui se agrupan las que son de la misma persona y
   al guardar se vuelven a separar. */
export interface ContactValues {
  areas: ContactArea[];
  /* Las areas propias de la empresa, por su nombre ("Farmacia"). Las
     sugeridas no cubren todas las formas de organizarse. */
  customAreas: string[];
  name: string;
  position: string;
  email: string;
  phone: string;
}

const emptyContact = (): ContactValues => ({
  areas: [],
  customAreas: [],
  name: '',
  position: '',
  email: '',
  phone: '',
});

/* Dos filas son de la misma persona si coinciden en todo menos el area. */
const personKey = (contact: OrganizationContact) =>
  [contact.name, contact.position ?? '', contact.email, contact.phone ?? ''].join('\u0000');

/* Siempre al menos uno, para que haya donde escribir el primero. */
export const toContactsValues = (contacts: OrganizationContact[] | undefined): ContactValues[] => {
  const people = new Map<string, ContactValues>();
  for (const contact of contacts ?? []) {
    const key = personKey(contact);
    const person = people.get(key);
    const custom = contact.area === 'OTHER' && contact.customArea ? [contact.customArea] : [];
    const area = contact.area === 'OTHER' ? [] : [contact.area];
    if (person) {
      person.areas.push(...area);
      person.customAreas.push(...custom);
    } else {
      people.set(key, {
        areas: area,
        customAreas: custom,
        name: contact.name,
        position: contact.position ?? '',
        email: contact.email,
        phone: contact.phone ?? '',
      });
    }
  }
  return people.size > 0 ? [...people.values()] : [emptyContact()];
};

/* De vuelta al contrato del backend: una fila por area. Las personas en
   blanco no viajan; el formulario ya comprobo que las demas traen area. */
export const toContactRows = (contacts: ContactValues[]): OrganizationContact[] =>
  contacts
    .filter((contact) => !isContactEmpty(contact))
    .flatMap((contact) => {
      const person = {
        name: contact.name.trim(),
        position: contact.position.trim() || null,
        email: contact.email.trim(),
        phone: contact.phone.trim() || null,
      };
      return [
        ...contact.areas.map((area) => ({ area, customArea: null, ...person })),
        ...contact.customAreas.map((customArea) => ({
          area: 'OTHER' as const,
          customArea,
          ...person,
        })),
      ];
    });

export const isContactEmpty = (contact: ContactValues): boolean =>
  contact.areas.length === 0 &&
  contact.customAreas.length === 0 &&
  [contact.name, contact.position, contact.email, contact.phone].every(
    (value) => value.trim() === '',
  );

interface ContactPeopleFieldsProps {
  /* Las areas sugeridas de este lado del marketplace. */
  areaOptions: { value: ContactArea; label: string }[];
  /* Las que admiten varias personas: los auxiliares de compras. */
  multiAreas?: ContactArea[];
  /* Las areas propias de la empresa. Son de la empresa y no de una persona:
     se crean una vez, arriba, y cada persona marca las suyas. */
  customAreas: string[];
  onCustomAreasChange: (areas: string[]) => void;
  /* El proveedor dice el cargo; el comprador no, porque su area ya lo es. */
  showPosition?: boolean;
  description: string;
  addLabel?: string;
  warning?: string;
  contacts: ContactValues[];
  /* Por indice; el formulario los calcula al guardar. */
  errors: Record<number, string>;
  onChange: (contacts: ContactValues[]) => void;
}

/* Las personas de contacto, comunes a proveedor y comprador: una tarjeta por
   persona con las areas de las que se encarga. Se empieza con una y se añaden
   las que hagan falta hasta cubrir todas las areas: pedir cinco formularios
   de entrada asustaba antes de empezar, y en las empresas pequeñas la misma
   persona responde por varias.

   Las areas propias se nombran una sola vez, en el bloque de arriba, y
   aparecen como casilla en todas las tarjetas. Antes el campo para crearlas
   iba dentro de cada tarjeta: se repetia por persona, y daba a entender que
   el area era de quien la escribia. */
const ContactPeopleFields = ({
  areaOptions,
  multiAreas = [],
  customAreas,
  onCustomAreasChange,
  showPosition = true,
  description,
  addLabel = 'Añadir contacto',
  warning,
  contacts,
  errors,
  onChange,
}: ContactPeopleFieldsProps) => {
  const [newArea, setNewArea] = useState('');

  const setContact = (index: number, changes: Partial<ContactValues>) =>
    onChange(contacts.map((contact, i) => (i === index ? { ...contact, ...changes } : contact)));

  /* Una que ya existe —sugerida o propia, escrita con otras mayusculas— no
     se duplica. */
  const nombreNuevo = newArea.trim().replace(/\s+/g, ' ');
  const yaExiste =
    areaOptions.some((option) => option.label.toLowerCase() === nombreNuevo.toLowerCase()) ||
    customAreas.some((area) => area.toLowerCase() === nombreNuevo.toLowerCase());

  const addCustomArea = () => {
    if (!nombreNuevo || yaExiste) return;
    onCustomAreasChange([...customAreas, nombreNuevo]);
    setNewArea('');
  };

  /* Quitar un area propia la quita tambien de quien la tenia marcada. */
  const removeCustomArea = (name: string) => {
    onCustomAreasChange(customAreas.filter((area) => area !== name));
    onChange(
      contacts.map((contact) => ({
        ...contact,
        customAreas: contact.customAreas.filter((area) => area !== name),
      })),
    );
  };

  const toggleCustomArea = (index: number, name: string) => {
    const current = contacts[index].customAreas;
    setContact(index, {
      customAreas: current.includes(name)
        ? current.filter((area) => area !== name)
        : [...current, name],
    });
  };

  const toggleArea = (index: number, area: ContactArea) => {
    const { areas } = contacts[index];
    setContact(index, {
      areas: areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area],
    });
  };

  /* Quitar el unico que queda lo vacia en vez de dejar el panel sin campos. */
  const removeContact = (index: number) =>
    onChange(contacts.length === 1 ? [emptyContact()] : contacts.filter((_, i) => i !== index));

  /* Otra persona tiene sentido si queda un area sin nadie, o si hay areas
     que admiten varias. */
  const covered = new Set(contacts.flatMap((contact) => contact.areas));
  const canAddPerson =
    multiAreas.length > 0 ||
    customAreas.length > 0 ||
    areaOptions.some((option) => !covered.has(option.value));

  return (
    <Panel
      id={SECTION.contacts}
      warning={warning}
      title='Datos de contacto'
      description={description}
    >
      <div className='form-grid'>
        {/* Las areas propias, una vez para todo el panel. */}
        <div className='form-grid-full contact-custom-areas'>
          <label className='form-label' htmlFor='contactos-area-nueva'>
            Otras áreas de tu empresa
          </label>
          <small className='font-light d-block'>
            Si tu empresa tiene áreas que no están en la lista, añádelas aquí. Después marca en
            cada persona las que le corresponden.
          </small>
          {customAreas.length > 0 && (
            <div className='contact-custom-areas-list'>
              {customAreas.map((name) => (
                <button
                  type='button'
                  key={name}
                  className='filter-chip'
                  aria-label={`Quitar el área ${name}`}
                  title='Quitar área'
                  onClick={() => removeCustomArea(name)}
                >
                  <span>{name}</span>
                  <X size={13} />
                </button>
              ))}
            </div>
          )}
          <div className='contact-new-area'>
            <input
              id='contactos-area-nueva'
              type='text'
              maxLength={80}
              className='form-control'
              placeholder='Por ejemplo: Farmacia'
              value={newArea}
              onChange={(event) => setNewArea(event.target.value)}
              onKeyDown={(event) => {
                /* Enter añade el area; sin esto enviaria el formulario. */
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addCustomArea();
                }
              }}
            />
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              disabled={!nombreNuevo || yaExiste}
              onClick={addCustomArea}
            >
              <Plus size={15} /> Añadir área
            </button>
          </div>
          {nombreNuevo && yaExiste && (
            <small className='font-light d-block'>Esa área ya está en la lista.</small>
          )}
        </div>

        {contacts.map((contact, index) => {
          const id = (field: string) => `contacto-${index}-${field}`;
          /* Un contacto por area: cada persona ofrece las suyas y las que
               nadie ha tomado todavia. Las que admiten varias personas se
               ofrecen siempre. */
          const taken = new Set(
            contacts.filter((_, i) => i !== index).flatMap((other) => other.areas),
          );
          const areas = areaOptions.filter(
            (option) => multiAreas.includes(option.value) || !taken.has(option.value),
          );

          return (
            <fieldset className='form-grid-full contact-area' key={index}>
              {/* Un div y no un legend: el navegador pinta el legend encima del
                  borde del bloque, y la linea entre contactos quedaba
                  escondida detras del titulo. */}
              <div className='contact-area-head'>
                <span className='form-group-title'>
                  {contacts.length > 1 ? `Contacto ${index + 1}` : 'Contacto'}
                </span>
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  aria-label='Quitar contacto'
                  title='Quitar contacto'
                  onClick={() => removeContact(index)}
                >
                  <X size={15} />
                </button>
              </div>
              <div className='form-grid'>
                <fieldset className='form-grid-full'>
                  <legend className='form-label'>Áreas de las que se encarga</legend>
                  <div className='yes-no'>
                    {areas.map((option) => (
                      <div className='form-check' key={option.value}>
                        <input
                          id={id(`area-${option.value}`)}
                          type='checkbox'
                          className='form-check-input'
                          checked={contact.areas.includes(option.value)}
                          onChange={() => toggleArea(index, option.value)}
                        />
                        <label className='form-check-label' htmlFor={id(`area-${option.value}`)}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                    {customAreas.map((name, i) => (
                      <div className='form-check' key={`propia-${name}`}>
                        <input
                          id={id(`propia-${i}`)}
                          type='checkbox'
                          className='form-check-input'
                          checked={contact.customAreas.includes(name)}
                          onChange={() => toggleCustomArea(index, name)}
                        />
                        <label className='form-check-label' htmlFor={id(`propia-${i}`)}>
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label className='form-label' htmlFor={id('nombre')}>
                    Nombre
                  </label>
                  <input
                    id={id('nombre')}
                    type='text'
                    className='form-control'
                    value={contact.name}
                    onChange={(event) => setContact(index, { name: event.target.value })}
                  />
                </div>
                {showPosition && (
                  <div>
                    <label className='form-label' htmlFor={id('cargo')}>
                      Cargo
                    </label>
                    <input
                      id={id('cargo')}
                      type='text'
                      className='form-control'
                      value={contact.position}
                      onChange={(event) => setContact(index, { position: event.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className='form-label' htmlFor={id('correo')}>
                    Correo
                  </label>
                  <input
                    id={id('correo')}
                    type='email'
                    className='form-control'
                    value={contact.email}
                    onChange={(event) => setContact(index, { email: event.target.value })}
                  />
                </div>
                <div>
                  <label className='form-label' htmlFor={id('celular')}>
                    Celular
                  </label>
                  <input
                    id={id('celular')}
                    type='tel'
                    inputMode='tel'
                    className='form-control'
                    placeholder='300 123 4567'
                    value={contact.phone}
                    onChange={(event) => setContact(index, { phone: event.target.value })}
                  />
                </div>
              </div>
              {errors[index] && <small className='text-danger'>{errors[index]}</small>}
            </fieldset>
          );
        })}

        {canAddPerson && (
          <div className='form-grid-full'>
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              onClick={() => onChange([...contacts, emptyContact()])}
            >
              <Plus size={15} /> {addLabel}
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default ContactPeopleFields;

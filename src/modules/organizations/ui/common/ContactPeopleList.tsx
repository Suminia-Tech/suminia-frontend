'use client';

import { Mail, Phone } from 'react-feather';

import { contactAreaLabel, MULTI_CONTACT_AREAS } from '../../lib/commercialProfile';
import type { ContactArea, OrganizationContact } from '../../model/organization.types';

/* Los contactos de una empresa, por persona y no por area.

   Una misma persona suele cubrir varias areas —en una empresa pequeña la
   directora comercial es tambien la de cartera y la de facturacion—, y
   listarlos por area la repetia cinco veces con su correo completo, en
   columnas donde el correo no cabia. Aqui cada persona sale una vez, en su
   tarjeta, con las areas que atiende como etiquetas. Las areas sin nadie se
   dicen al final, para que no se confunda "falta" con "no aplica". */

interface ContactPeopleListProps {
  contacts: OrganizationContact[];
  /** Las areas sugeridas, en su orden, para ordenar y para decir cuales faltan. */
  areas: { value: ContactArea; label: string }[];
}

interface Persona {
  key: string;
  name: string;
  position: string | null;
  email: string;
  phone: string | null;
  areas: string[];
}

export const ContactPeopleList = ({ contacts, areas }: ContactPeopleListProps) => {
  const orden = (contact: OrganizationContact) => {
    const i = areas.findIndex((a) => a.value === contact.area);
    return i === -1 ? areas.length : i;
  };

  /* La misma persona es el mismo correo: el nombre se escribe distinto de
     un area a otra, el correo no. */
  const personas = new Map<string, Persona>();
  [...contacts]
    .sort((a, b) => orden(a) - orden(b))
    .forEach((contact) => {
      const key = (contact.email || contact.name).trim().toLowerCase();
      const actual = personas.get(key);
      const area = contactAreaLabel(contact);
      if (actual) {
        if (!actual.areas.includes(area)) actual.areas.push(area);
        actual.phone ??= contact.phone;
        actual.position ??= contact.position;
      } else {
        personas.set(key, {
          key,
          name: contact.name,
          position: contact.position,
          email: contact.email,
          phone: contact.phone,
          areas: [area],
        });
      }
    });

  const sinNadie = areas
    .filter(
      (a) => !MULTI_CONTACT_AREAS.includes(a.value) && !contacts.some((c) => c.area === a.value),
    )
    .map((a) => a.label);

  return (
    <>
      {personas.size > 0 && (
        <ul className='contact-people'>
          {[...personas.values()].map((persona) => (
            <li key={persona.key} className='contact-person'>
              <div className='contact-person-areas'>
                {persona.areas.map((area) => (
                  <span key={area} className='chip'>
                    {area}
                  </span>
                ))}
              </div>
              <strong>{persona.name}</strong>
              {persona.position && <span className='font-light'>{persona.position}</span>}
              {persona.email && (
                <a href={`mailto:${persona.email}`} className='contact-person-line'>
                  <Mail size={14} />
                  <span>{persona.email}</span>
                </a>
              )}
              {persona.phone && (
                <a href={`tel:${persona.phone.replace(/\s/g, '')}`} className='contact-person-line'>
                  <Phone size={14} />
                  <span>{persona.phone}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {sinNadie.length > 0 && (
        <p className='font-light contact-people-missing'>
          Sin contacto: {sinNadie.join(', ')}.
        </p>
      )}
    </>
  );
};

export default ContactPeopleList;

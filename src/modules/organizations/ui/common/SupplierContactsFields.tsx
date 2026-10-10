'use client';

import { Plus, X } from 'react-feather';

import { Panel } from '@/shared/ui';

import { CONTACT_AREA_OPTIONS } from '../../lib/commercialProfile';
import type { ContactArea, OrganizationContact } from '../../model/organization.types';

/* Lo que se escribe de cada contacto. Todo cadena: el formulario no distingue
   "vacio" de "sin dato" hasta que se guarda, y el area vacia es "sin elegir". */
export interface ContactValues {
  area: ContactArea | '';
  name: string;
  position: string;
  email: string;
  phone: string;
}

/* Los topes que acepta el backend: un contacto por area, y cinco correos. */
export const MAX_CONTACTS = CONTACT_AREA_OPTIONS.length;
export const MAX_ORDER_EMAILS = 5;

const emptyContact = (): ContactValues => ({
  area: '',
  name: '',
  position: '',
  email: '',
  phone: '',
});

/* Siempre al menos uno, para que haya donde escribir el primero. */
export const toContactsValues = (
  contacts: OrganizationContact[] | undefined,
): ContactValues[] =>
  contacts?.length
    ? contacts.map((contact) => ({
        area: contact.area,
        name: contact.name,
        position: contact.position ?? '',
        email: contact.email,
        phone: contact.phone ?? '',
      }))
    : [emptyContact()];

export const isContactEmpty = (contact: ContactValues): boolean =>
  Object.values(contact).every((value) => value.trim() === '');

interface SupplierContactsFieldsProps {
  contacts: ContactValues[];
  orderEmails: string[];
  /* Por indice; el formulario los calcula al guardar. */
  contactErrors: Record<number, string>;
  orderEmailErrors: Record<number, string>;
  onContactsChange: (contacts: ContactValues[]) => void;
  onOrderEmailsChange: (emails: string[]) => void;
}

/* Las personas de contacto y los buzones de las ordenes de compra. Se empieza
   con uno y se añaden los que la empresa quiera: pedir cinco de entrada era un
   formulario que asustaba antes de empezar, y a muchas empresas pequeñas les
   contesta la misma persona para todo.

   Son datos para Suminia: los compradores no los ven, y el panel lo dice para
   que nadie deje de llenarlos por miedo a recibir llamadas de clientes. */
const SupplierContactsFields = ({
  contacts,
  orderEmails,
  contactErrors,
  orderEmailErrors,
  onContactsChange,
  onOrderEmailsChange,
}: SupplierContactsFieldsProps) => {
  const setContact = (index: number, field: keyof ContactValues, value: string) =>
    onContactsChange(
      contacts.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact)),
    );

  /* Quitar el unico que queda lo vacia en vez de dejar el panel sin campos. */
  const removeContact = (index: number) =>
    onContactsChange(
      contacts.length === 1 ? [emptyContact()] : contacts.filter((_, i) => i !== index),
    );

  const setOrderEmail = (index: number, value: string) =>
    onOrderEmailsChange(orderEmails.map((email, i) => (i === index ? value : email)));

  const removeOrderEmail = (index: number) =>
    onOrderEmailsChange(
      orderEmails.length === 1 ? [''] : orderEmails.filter((_, i) => i !== index),
    );

  return (
    <>
      <Panel
        title='Datos de contacto'
        description='Gestiona los contactos responsables de las áreas comerciales, operativas y administrativas de tu empresa. Son solo para Suminia: los compradores no los ven.'
      >
        <div className='form-grid'>
          {contacts.map((contact, index) => {
            const id = (field: string) => `contacto-${index}-${field}`;
            /* Un contacto por area: cada uno ofrece la suya y las que nadie
               ha tomado todavia. */
            const taken = contacts
              .filter((_, i) => i !== index)
              .map((other) => other.area);
            const areas = CONTACT_AREA_OPTIONS.filter(
              (option) => !taken.includes(option.value),
            );

            return (
              <fieldset className='form-grid-full contact-area' key={index}>
                <legend className='contact-area-head'>
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
                </legend>
                <div className='form-grid'>
                  <div>
                    <label className='form-label' htmlFor={id('area')}>Área</label>
                    <select
                      id={id('area')}
                      className='form-control'
                      value={contact.area}
                      onChange={(event) => setContact(index, 'area', event.target.value)}
                    >
                      <option value=''>Elige el área</option>
                      {areas.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='form-label' htmlFor={id('nombre')}>Nombre</label>
                    <input
                      id={id('nombre')}
                      type='text'
                      className='form-control'
                      value={contact.name}
                      onChange={(event) => setContact(index, 'name', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className='form-label' htmlFor={id('cargo')}>Cargo</label>
                    <input
                      id={id('cargo')}
                      type='text'
                      className='form-control'
                      value={contact.position}
                      onChange={(event) => setContact(index, 'position', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className='form-label' htmlFor={id('correo')}>Correo</label>
                    <input
                      id={id('correo')}
                      type='email'
                      className='form-control'
                      value={contact.email}
                      onChange={(event) => setContact(index, 'email', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className='form-label' htmlFor={id('telefono')}>Teléfono</label>
                    <input
                      id={id('telefono')}
                      type='tel'
                      className='form-control'
                      value={contact.phone}
                      onChange={(event) => setContact(index, 'phone', event.target.value)}
                    />
                  </div>
                </div>
                {contactErrors[index] && (
                  <small className='text-danger'>{contactErrors[index]}</small>
                )}
              </fieldset>
            );
          })}

          {contacts.length < MAX_CONTACTS && (
            <div className='form-grid-full'>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm btn-with-icon'
                onClick={() => onContactsChange([...contacts, emptyContact()])}
              >
                <Plus size={15} /> Añadir contacto
              </button>
            </div>
          )}
        </div>
      </Panel>

      <Panel
        title='Correos para órdenes de compra'
        description='Cada orden de compra que recibas llega a estos correos. Puedes poner varios si el pedido debe llegar a la vez a ventas y a bodega.'
      >
        <div className='order-emails'>
          {orderEmails.map((email, index) => (
            <div key={index}>
              <div className='order-email-row'>
                <input
                  type='email'
                  className='form-control'
                  aria-label={`Correo para órdenes ${index + 1}`}
                  placeholder='pedidos@tuempresa.com'
                  value={email}
                  onChange={(event) => setOrderEmail(index, event.target.value)}
                />
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  aria-label='Quitar correo'
                  title='Quitar correo'
                  onClick={() => removeOrderEmail(index)}
                >
                  <X size={15} />
                </button>
              </div>
              {orderEmailErrors[index] && (
                <small className='text-danger'>{orderEmailErrors[index]}</small>
              )}
            </div>
          ))}

          {orderEmails.length < MAX_ORDER_EMAILS && (
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              onClick={() => onOrderEmailsChange([...orderEmails, ''])}
            >
              <Plus size={15} /> Añadir correo
            </button>
          )}
        </div>
      </Panel>
    </>
  );
};

export default SupplierContactsFields;

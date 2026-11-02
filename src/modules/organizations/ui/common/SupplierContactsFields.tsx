'use client';

import { Plus, X } from 'react-feather';

import { Panel } from '@/shared/ui';

import { CONTACT_AREA_OPTIONS } from '../../lib/commercialProfile';
import { SECTION } from '../../lib/pendings';
import ContactPeopleFields, { type ContactValues } from './ContactPeopleFields';

export {
  isContactEmpty,
  toContactRows,
  toContactsValues,
  type ContactValues,
} from './ContactPeopleFields';

/* El tope que acepta el backend para los correos de las ordenes. */
export const MAX_ORDER_EMAILS = 5;

interface SupplierContactsFieldsProps {
  /* Lo que falta llenar en cada panel, si falta algo. */
  contactsWarning?: string;
  orderEmailsWarning?: string;
  contacts: ContactValues[];
  customAreas: string[];
  onCustomAreasChange: (areas: string[]) => void;
  orderEmails: string[];
  /* Por indice; el formulario los calcula al guardar. */
  contactErrors: Record<number, string>;
  orderEmailErrors: Record<number, string>;
  onContactsChange: (contacts: ContactValues[]) => void;
  onOrderEmailsChange: (emails: string[]) => void;
}

/* Las personas de contacto del proveedor y los buzones de sus ordenes de
   compra. */
const SupplierContactsFields = ({
  contactsWarning,
  orderEmailsWarning,
  contacts,
  customAreas,
  onCustomAreasChange,
  orderEmails,
  contactErrors,
  orderEmailErrors,
  onContactsChange,
  onOrderEmailsChange,
}: SupplierContactsFieldsProps) => {
  const setOrderEmail = (index: number, value: string) =>
    onOrderEmailsChange(orderEmails.map((email, i) => (i === index ? value : email)));

  const removeOrderEmail = (index: number) =>
    onOrderEmailsChange(
      orderEmails.length === 1 ? [''] : orderEmails.filter((_, i) => i !== index),
    );

  return (
    <>
      <ContactPeopleFields
        areaOptions={CONTACT_AREA_OPTIONS}
        description='Gestiona los contactos responsables de las áreas comerciales, operativas y administrativas de tu empresa. Cada área necesita un contacto, y una misma persona puede encargarse de varias.'
        warning={contactsWarning}
        contacts={contacts}
        customAreas={customAreas}
        onCustomAreasChange={onCustomAreasChange}
        errors={contactErrors}
        onChange={onContactsChange}
      />

      <Panel
        id={SECTION.orderEmails}
        warning={orderEmailsWarning}
        title='Correos para órdenes de compra'
        description='Cada orden de compra que recibas llega a estos correos. Añade la mayor cantidad de correos posibles, esto permitirá una mejor recepción y seguimiento de las órdenes de compra.'
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

'use client';

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';

import { isEmail } from '@/shared/lib/validators';
import { Panel } from '@/shared/ui';

import { ACTIVITY_OPTIONS, PRODUCT_LINE_OPTIONS } from '../../lib/commercialProfile';
import { avisoDe, SECTION, type Pending } from '../../lib/pendings';
import { formatTaxId } from '../../lib/taxId';
import type {
  Organization,
  SupplierActivity,
  SupplierProductLine,
} from '../../model/organization.types';
import BuyerProfileFields, {
  type BuyerProfileErrors,
  type BuyerProfileValues,
  validateBuyerProfile,
} from './BuyerProfileFields';
import SupplierContactsFields, {
  isContactEmpty,
  toContactsValues,
  type ContactValues,
} from './SupplierContactsFields';

/* A donde se escribe para cambiar lo que no se edita desde el panel. */
const SUPPORT_EMAIL = 'soporte@suminia.io';

/* Formulario comun a proveedores y compradores: los campos salen de
   Organization, que es la tabla que ambos comparten en el backend.

   Usa las clases del tema (form-label, form-control, box-head) en lugar de los
   componentes de reactstrap sin estilar, para que la pantalla se vea como el
   resto del panel de cuenta.

   taxId y legalName se muestran pero no se editan: identifican legalmente a la
   empresa y el DTO del backend los rechaza con 422. Cambiarlos es un tramite
   que pasa por el personal interno de Suminia. */

export interface OrganizationFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  /* Solo lo manda el proveedor. Cadena vacia significa "sin minimo", que no es
     lo mismo que cero: cero seria exigir un minimo de nada. */
  minOrderValue: string;
  /* El plazo de entrega en dias habiles, como rango. Vacios los dos: sin
     decir. */
  deliveryDaysMin: string;
  deliveryDaysMax: string;

  /* La cuenta a donde se le consigna. Tambien solo del proveedor. */
  bankName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankAccountHolderTaxId: string;

  /* El perfil comercial, tambien solo del proveedor. exporter va como cadena
     porque son tres respuestas y no dos: vacia es "no lo ha dicho". */
  activities: SupplierActivity[];
  productLines: SupplierProductLine[];
  exporter: '' | 'yes' | 'no';

  /* Las personas de cada area y los buzones de las ordenes de compra. Solo del
     proveedor. */
  contacts: ContactValues[];
  orderEmails: string[];

  /* El perfil del comprador. Vacio es "sin elegir". */
  legalNature: BuyerProfileValues['legalNature'];
  buyerActivity: BuyerProfileValues['buyerActivity'];
  ipsSector: BuyerProfileValues['ipsSector'];
  activityOther: string;
}

/* Los campos que se escriben; las listas y los contactos van por su lado. */
type TextField = Exclude<
  keyof OrganizationFormValues,
  | 'activities'
  | 'productLines'
  | 'contacts'
  | 'orderEmails'
  | 'legalNature'
  | 'buyerActivity'
  | 'ipsSector'
>;

interface OrganizationFormProps {
  organization: Organization;
  isSaving: boolean;
  onSubmit: (values: OrganizationFormValues) => void;
  /* El minimo por pedido solo aparece del lado del proveedor: es lo que exige
     para despachar, y en un comprador no significaria nada. */
  showSupplierFields?: boolean;
  /* Los documentos legales se suben al momento, no con "Guardar cambios", y por
     eso llegan ya armados: el formulario solo decide donde van. */
  legalDocuments?: ReactNode;
  /* Lo que falta llenar, para marcar el panel donde se llena. Se calcula sobre
     lo guardado: el aviso se va al guardar, no al empezar a escribir. */
  pendientes?: Pending[];
}

const toValues = (organization: Organization): OrganizationFormValues => ({
  name: organization.name,
  email: organization.email,
  phone: organization.phone ?? '',
  address: organization.address ?? '',
  city: organization.city ?? '',
  minOrderValue: organization.minOrderValue === null ? '' : String(organization.minOrderValue),
  deliveryDaysMin:
    organization.deliveryDaysMin == null ? '' : String(organization.deliveryDaysMin),
  deliveryDaysMax:
    organization.deliveryDaysMax == null ? '' : String(organization.deliveryDaysMax),
  bankName: organization.bankName ?? '',
  bankAccountType: organization.bankAccountType ?? '',
  bankAccountNumber: organization.bankAccountNumber ?? '',
  bankAccountHolder: organization.bankAccountHolder ?? '',
  bankAccountHolderTaxId: organization.bankAccountHolderTaxId ?? '',
  activities: organization.activities ?? [],
  productLines: organization.productLines ?? [],
  exporter:
    organization.exporter === null || organization.exporter === undefined
      ? ''
      : organization.exporter
        ? 'yes'
        : 'no',
  contacts: toContactsValues(organization.contacts),
  /* Siempre al menos un campo, para que haya donde escribir el primero. */
  orderEmails: organization.orderEmails?.length ? organization.orderEmails : [''],
  legalNature: organization.legalNature ?? '',
  buyerActivity: organization.buyerActivity ?? '',
  ipsSector: organization.ipsSector ?? '',
  activityOther: organization.activityOther ?? '',
});

const OrganizationForm = ({
  organization,
  isSaving,
  onSubmit,
  showSupplierFields = false,
  legalDocuments,
  pendientes = [],
}: OrganizationFormProps) => {
  /* El estado inicial se toma una sola vez. Para recoger los datos frescos tras
     guardar, quien renderiza este formulario le pasa una `key` que cambia con
     updatedAt: React lo remonta y vuelve a leer las props. Es preferible a
     sincronizar con un efecto, que provoca un render en cascada. */
  const [values, setValues] = useState<OrganizationFormValues>(() => toValues(organization));

  /* El paso a seguir para cambiar NIT o razon social. Se muestra al pedirlo y
     no siempre: es un tramite raro, y el aviso permanente sugeriria que hay
     algo que corregir. */
  const [showLegalChange, setShowLegalChange] = useState(false);

  const [contactErrors, setContactErrors] = useState<Record<number, string>>({});
  const [orderEmailErrors, setOrderEmailErrors] = useState<Record<number, string>>({});
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  const handleChange =
    (field: TextField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
    };

  const handleToggle =
    <K extends 'activities' | 'productLines'>(
      field: K,
      option: OrganizationFormValues[K][number],
    ) =>
    () => {
      setValues((current) => {
        const list = current[field] as OrganizationFormValues[K][number][];
        return {
          ...current,
          [field]: list.includes(option)
            ? list.filter((item) => item !== option)
            : [...list, option],
        };
      });
    };

  /* Un contacto a medias no sirve: sin area no se sabe de que se le habla, sin
     nombre no se sabe a quien se busca, y sin correo no hay como escribirle. Un
     contacto entero en blanco si vale: es el que aparece de entrada y nadie
     lleno. */
  const validateSupplierFields = (): boolean => {
    const nextContactErrors: Record<number, string> = {};
    values.contacts.forEach((contact, index) => {
      if (isContactEmpty(contact)) return;
      if (!contact.area || !contact.name.trim() || !contact.email.trim()) {
        nextContactErrors[index] = 'Para guardar este contacto faltan el área, el nombre y el correo.';
      } else if (!isEmail(contact.email.trim())) {
        nextContactErrors[index] = 'El correo no es válido.';
      }
    });

    const nextOrderEmailErrors: Record<number, string> = {};
    values.orderEmails.forEach((email, index) => {
      if (email.trim() && !isEmail(email.trim())) {
        nextOrderEmailErrors[index] = 'El correo no es válido.';
      }
    });

    /* El plazo es un rango: los dos extremos o ninguno, y el primero no
       pasa al segundo. */
    const desde = values.deliveryDaysMin.trim();
    const hasta = values.deliveryDaysMax.trim();
    let nextDeliveryError: string | null = null;
    if ((desde === '') !== (hasta === '')) {
      nextDeliveryError = 'Indica el plazo completo: desde y hasta.';
    } else if (desde !== '' && Number(desde) > Number(hasta)) {
      nextDeliveryError = 'El primer número no puede ser mayor que el segundo.';
    }

    setContactErrors(nextContactErrors);
    setOrderEmailErrors(nextOrderEmailErrors);
    setDeliveryError(nextDeliveryError);
    return (
      Object.keys(nextContactErrors).length === 0 &&
      Object.keys(nextOrderEmailErrors).length === 0 &&
      nextDeliveryError === null
    );
  };

  const [buyerErrors, setBuyerErrors] = useState<BuyerProfileErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (showSupplierFields && !validateSupplierFields()) return;
    if (!showSupplierFields) {
      const errores = validateBuyerProfile(values);
      setBuyerErrors(errores);
      if (Object.keys(errores).length > 0) return;
    }
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Un panel por asunto, y cada uno dice para que sirve lo que pide. Antes
          eran cuatro `box-head` sobre el fondo gris, con los campos flotando
          debajo: el formulario no tenia ni principio ni final, y nada ataba un
          grupo de campos a su titulo. */}
      <Panel
        title='Datos legales'
        description='Información legal verificada de tu empresa. Solicita autorización para editarla en caso de ser necesario.'
        aside={
          <button
            type='button'
            className='btn btn-outline-secondary btn-sm'
            aria-expanded={showLegalChange}
            onClick={() => setShowLegalChange((current) => !current)}
          >
            Solicitar cambio de información legal
          </button>
        }
      >
        {showLegalChange && (
          <div className='alert alert-info'>
            Escribe un correo a{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Cambio de información legal - NIT ${formatTaxId(organization.taxId)}`)}`}
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            adjuntando el documento que acredite la modificación. Nuestro equipo realizará la
            revisión y la modificación en el menor tiempo posible.
          </div>
        )}

        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='empresa-nit'>NIT</label>
            <input
              id='empresa-nit'
              type='text'
              className='form-control'
              value={formatTaxId(organization.taxId)}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className='form-label' htmlFor='empresa-razon'>Razón social</label>
            <input
              id='empresa-razon'
              type='text'
              className='form-control'
              value={organization.legalName}
              disabled
              readOnly
            />
          </div>
        </div>
      </Panel>

      {legalDocuments}

      {/* Del lado del proveedor, lo que identifica a la empresa va aparte de
          las personas de contacto: el correo y el telefono generales los
          reemplazan los contactos por area. El comprador sigue como estaba. */}
      {showSupplierFields ? (
        <Panel
          id={SECTION.info}
          warning={avisoDe(pendientes, 'city')}
          title='Información de la empresa'
          description='Cómo se llama tu empresa en Suminia y desde dónde opera.'
        >
          <div className='form-grid'>
            <div>
              <label className='form-label' htmlFor='empresa-nombre'>Nombre comercial</label>
              <input
                id='empresa-nombre'
                type='text'
                className='form-control'
                value={values.name}
                onChange={handleChange('name')}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='empresa-ciudad'>Ciudad</label>
              <input
                id='empresa-ciudad'
                type='text'
                className={`form-control${avisoDe(pendientes, 'city') && !values.city.trim() ? ' is-missing' : ''}`}
                value={values.city}
                onChange={handleChange('city')}
              />
            </div>
            <div className='form-grid-full'>
              <label className='form-label' htmlFor='empresa-direccion'>Dirección</label>
              <input
                id='empresa-direccion'
                type='text'
                className='form-control'
                value={values.address}
                onChange={handleChange('address')}
              />
            </div>
          </div>
        </Panel>
      ) : (
        <Panel title='Datos de contacto' description='A donde te llegan los avisos de cada pedido.'>
          <div className='form-grid'>
            <div>
              <label className='form-label' htmlFor='empresa-nombre'>Nombre comercial</label>
              <input
                id='empresa-nombre'
                type='text'
                className='form-control'
                value={values.name}
                onChange={handleChange('name')}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='empresa-correo'>Correo de contacto</label>
              <input
                id='empresa-correo'
                type='email'
                className='form-control'
                value={values.email}
                onChange={handleChange('email')}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='empresa-telefono'>Teléfono</label>
              <input
                id='empresa-telefono'
                type='text'
                className='form-control'
                value={values.phone}
                onChange={handleChange('phone')}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='empresa-ciudad'>Ciudad</label>
              <input
                id='empresa-ciudad'
                type='text'
                className={`form-control${avisoDe(pendientes, 'city') && !values.city.trim() ? ' is-missing' : ''}`}
                value={values.city}
                onChange={handleChange('city')}
              />
            </div>
            <div className='form-grid-full'>
              <label className='form-label' htmlFor='empresa-direccion'>Dirección</label>
              <input
                id='empresa-direccion'
                type='text'
                className='form-control'
                value={values.address}
                onChange={handleChange('address')}
              />
            </div>
          </div>
        </Panel>
      )}

      {!showSupplierFields && (
        <BuyerProfileFields
          natureWarning={avisoDe(pendientes, 'buyerNature')}
          paymentWarning={avisoDe(pendientes, 'buyerPayment')}
          values={values}
          errors={buyerErrors}
          onChange={(cambios) => setValues((current) => ({ ...current, ...cambios }))}
        />
      )}

      {showSupplierFields && (
        <>
          <Panel
            id={SECTION.profile}
            warning={avisoDe(pendientes, 'profile')}
            title='Perfil comercial'
            description='Qué haces en la cadena y qué vendes. Con esto Suminia te presenta a los compradores que buscan lo que ofreces.'
          >
            <div className='form-grid'>
              <fieldset>
                <legend className='form-label'>¿Cuáles son tus actividades?</legend>
                {ACTIVITY_OPTIONS.map((option) => (
                  <div className='form-check' key={option.value}>
                    <input
                      id={`empresa-actividad-${option.value}`}
                      type='checkbox'
                      className='form-check-input'
                      checked={values.activities.includes(option.value)}
                      onChange={handleToggle('activities', option.value)}
                    />
                    <label
                      className='form-check-label'
                      htmlFor={`empresa-actividad-${option.value}`}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
                <small className='font-light'>Puedes marcar varias.</small>
              </fieldset>

              <fieldset>
                <legend className='form-label'>
                  ¿La empresa realiza actualmente operaciones de exportación?
                </legend>
                {(
                  [
                    { value: 'yes', label: 'Sí' },
                    { value: 'no', label: 'No' },
                  ] as const
                ).map((option) => (
                  <div className='form-check' key={option.value}>
                    <input
                      id={`empresa-exporta-${option.value}`}
                      type='radio'
                      name='empresa-exporta'
                      className='form-check-input'
                      checked={values.exporter === option.value}
                      onChange={() =>
                        setValues((current) => ({
                          ...current,
                          exporter: option.value,
                        }))
                      }
                    />
                    <label className='form-check-label' htmlFor={`empresa-exporta-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </fieldset>

              <fieldset className='form-grid-full'>
                <legend className='form-label'>¿Qué categorías de productos comercializas?</legend>
                <div className='check-grid'>
                  {PRODUCT_LINE_OPTIONS.map((option) => (
                    <div className='form-check' key={option.value}>
                      <input
                        id={`empresa-linea-${option.value}`}
                        type='checkbox'
                        className='form-check-input'
                        checked={values.productLines.includes(option.value)}
                        onChange={handleToggle('productLines', option.value)}
                      />
                      <label className='form-check-label' htmlFor={`empresa-linea-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <small className='font-light'>Puedes marcar varias.</small>
              </fieldset>
            </div>
          </Panel>

          <SupplierContactsFields
            contactsWarning={avisoDe(pendientes, 'contacts')}
            orderEmailsWarning={avisoDe(pendientes, 'orderEmails')}
            contacts={values.contacts}
            orderEmails={values.orderEmails}
            contactErrors={contactErrors}
            orderEmailErrors={orderEmailErrors}
            onContactsChange={(contacts) => setValues((current) => ({ ...current, contacts }))}
            onOrderEmailsChange={(orderEmails) =>
              setValues((current) => ({ ...current, orderEmails }))
            }
          />

          {/* "Politicas" y no "condiciones": es como se dice en el sector. Y
              "monto" porque es un valor en pesos, no un numero de unidades. */}
          <Panel
            title='Políticas comerciales'
            description='Lo que exiges para despachar un pedido.'
          >
            <div className='form-grid'>
              <div>
                <label className='form-label' htmlFor='empresa-minimo'>Monto mínimo</label>
                <input
                  id='empresa-minimo'
                  type='number'
                  min={0}
                  step={1000}
                  className='form-control'
                  placeholder='Sin mínimo'
                  value={values.minOrderValue}
                  onChange={handleChange('minOrderValue')}
                />
                <small className='font-light'>
                  El valor mínimo en pesos que despachas por pedido, sumado antes de IVA. Déjalo
                  vacío si no exiges mínimo. Es distinto de la cantidad mínima de cada presentación, que
                  se fija en el producto.
                </small>
              </div>
              <div>
                <span className='form-label d-block'>Tiempo de entrega</span>
                <div className='delivery-days'>
                  <input
                    id='empresa-entrega-desde'
                    type='number'
                    min={0}
                    max={90}
                    className='form-control'
                    aria-label='Días hábiles, desde'
                    placeholder='2'
                    value={values.deliveryDaysMin}
                    onChange={handleChange('deliveryDaysMin')}
                  />
                  <span className='font-light'>a</span>
                  <input
                    id='empresa-entrega-hasta'
                    type='number'
                    min={0}
                    max={90}
                    className='form-control'
                    aria-label='Días hábiles, hasta'
                    placeholder='5'
                    value={values.deliveryDaysMax}
                    onChange={handleChange('deliveryDaysMax')}
                  />
                  <span className='font-light'>días hábiles</span>
                </div>
                <small className='font-light'>
                  Cuánto tardas en entregar un pedido confirmado. Se muestra en la ficha de
                  cada producto tuyo.
                </small>
                {deliveryError && <small className='text-danger'>{deliveryError}</small>}
              </div>
            </div>
          </Panel>

          <Panel
            id={SECTION.bank}
            warning={avisoDe(pendientes, 'bank')}
            title='Cuenta para recibir pagos'
            description='A dónde Suminia te consigna lo que te corresponde de cada pedido. Va entera o vacía: media cuenta la rechaza el banco el día del pago.'
          >
            <div className='form-grid'>
              <div>
                <label className='form-label' htmlFor='empresa-banco'>Banco</label>
                <input
                  id='empresa-banco'
                  type='text'
                  className='form-control'
                  placeholder='Bancolombia'
                  value={values.bankName}
                  onChange={handleChange('bankName')}
                />
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-tipo-cuenta'>Tipo de cuenta</label>
                <select
                  id='empresa-tipo-cuenta'
                  className='form-control'
                  value={values.bankAccountType}
                  onChange={handleChange('bankAccountType')}
                >
                  <option value=''>Sin definir</option>
                  <option value='AHORROS'>Ahorros</option>
                  <option value='CORRIENTE'>Corriente</option>
                </select>
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-numero'>Número de cuenta</label>
                <input
                  id='empresa-numero'
                  type='text'
                  className='form-control'
                  value={values.bankAccountNumber}
                  onChange={handleChange('bankAccountNumber')}
                />
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-titular'>Titular</label>
                <input
                  id='empresa-titular'
                  type='text'
                  className='form-control'
                  value={values.bankAccountHolder}
                  onChange={handleChange('bankAccountHolder')}
                />
                <small className='font-light'>
                  Puede no ser la razón social: el banco valida el nombre contra el documento.
                </small>
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-titular-nit'>
                  NIT o cédula del titular
                </label>
                <input
                  id='empresa-titular-nit'
                  type='text'
                  className='form-control'
                  value={values.bankAccountHolderTaxId}
                  onChange={handleChange('bankAccountHolderTaxId')}
                />
              </div>
            </div>
          </Panel>
        </>
      )}

      {/* Un solo boton para todo el formulario, al final y fuera de los paneles:
          guarda todos a la vez, de modo que colgarlo del pie de uno de
          ellos sugeriria que solo guarda ese. */}
      <div className='form-actions'>
        <button type='submit' className='btn btn-primary' disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;

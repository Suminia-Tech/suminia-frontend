'use client';

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { toast } from 'react-toastify';

import { resolvePlace } from '@/shared/lib/colombia';
import { isColombianMobile, isEmail } from '@/shared/lib/validators';
import { CitySelect, DepartmentSelect, Panel } from '@/shared/ui';

import { isListedBank, OTHER_BANKS, RECOMMENDED_BANKS } from '@/shared/lib/banks';
import {
  ACTIVITY_OPTIONS,
  BUYER_CONTACT_AREA_OPTIONS,
  MULTI_CONTACT_AREAS,
  PRODUCT_LINE_OPTIONS,
} from '../../lib/commercialProfile';
import type { CompanySection as CompanyTab } from '../../lib/companySections';

/* El nombre de cada pestaña, para decir donde quedo un error. */
const TAB_TITLE: Record<CompanyTab, string> = {
  empresa: 'Datos generales',
  documentos: 'Documentos',
  contacto: 'Contactos',
  condiciones: 'Condiciones y pagos',
  perfil: 'Perfil y medio de pago',
};
import { avisoDe, SECTION, type Pending } from '../../lib/pendings';
import { deliveryError as deliveryErrorOf, toDeliveryValues, type DeliveryValues } from '../../lib/deliveryTime';
import { formatTaxId } from '../../lib/taxId';
import type {
  ActivityLines,
  Organization,
  SupplierActivity,
  SupplierProductLine,
} from '../../model/organization.types';
import BuyerProfileFields, {
  type BuyerProfileErrors,
  type BuyerProfileValues,
  validateBuyerProfile,
} from './BuyerProfileFields';
import {
  CityDeliveryTimesFields,
  DeliveryTimeInput,
  isCityDeliveryEmpty,
  toCityDeliveryValues,
  type CityDeliveryValues,
} from './DeliveryTimeFields';
import {
  CityShippingCostsFields,
  isCityShippingEmpty,
  toCityShippingValues,
  type CityShippingValues,
} from './ShippingCostFields';
import SupplierWarehousesFields, {
  isWarehouseEmpty,
  toWarehouseValues,
  type WarehouseValues,
} from './SupplierWarehousesFields';
import ContactPeopleFields from './ContactPeopleFields';
import SupplierContactsFields, {
  isContactEmpty,
  toContactsValues,
  type ContactValues,
} from './SupplierContactsFields';

/* A donde se escribe para cambiar lo que no se edita desde el panel. */
const SUPPORT_EMAIL = 'soporte@suminia.io';

/* El valor de "Otro" en la lista de bancos. No es un nombre que pueda tener
   un banco, para no confundirse con uno. */
const OTHER_BANK = '__otro__';

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
  /* De la lista del DANE: el departamento primero, y la ciudad dentro de el. */
  department: string;
  city: string;
  /* Solo lo manda el proveedor. Cadena vacia significa "sin minimo", que no es
     lo mismo que cero: cero seria exigir un minimo de nada. */
  minOrderValue: string;
  /* El tiempo de entrega general, y las ciudades donde es otro. */
  delivery: DeliveryValues;
  deliveryTimes: CityDeliveryValues[];
  /* El envio: gratis desde (vacio: no ofrece), su costo si no (vacio: no
     cobra), y las ciudades donde cuesta distinto. */
  freeShippingFrom: string;
  shippingCost: string;
  shippingCosts: CityShippingValues[];
  /* El descuento por pronto pago: si lo ofrece, cuanto y en cuantos dias.
     Vacio es "no lo ha dicho". */
  earlyPayment: '' | 'yes' | 'no';
  earlyPaymentRate: string;
  earlyPaymentDays: string;
  /* La condicion de pago: de contado o a credito, y a credito el plazo en
     dias. Se pregunta asi, y no con un numero donde 0 era "de contado",
     porque un campo de dias en blanco salia en la orden de compra como "Por
     definir" y nadie sabia que faltaba. */
  paymentCondition: '' | 'cash' | 'credit';
  paymentTermDays: string;

  /* La cuenta a donde se le consigna. Tambien solo del proveedor. */
  bankName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankAccountHolderTaxId: string;
  breBKey: string;

  /* El perfil comercial, tambien solo del proveedor. exporter va como cadena
     porque son tres respuestas y no dos: vacia es "no lo ha dicho". */
  /* Que lineas vende en cada actividad. Una actividad marcada esta en la
     lista aunque todavia no tenga lineas: la validacion se las pide. */
  activityLines: ActivityLines[];
  exporter: '' | 'yes' | 'no';
  /* Igual que exporter: vacia es "no ha respondido". */
  electronicInvoicing: '' | 'yes' | 'no';

  /* Las personas de cada area y los buzones de las ordenes de compra. Solo del
     proveedor. */
  contacts: ContactValues[];
  /* Las areas propias de la empresa: las guardadas y las que usa algun
     contacto. */
  customAreas: string[];
  orderEmails: string[];
  /* Las bodegas y puntos de inventario. Solo del proveedor. */
  warehouses: WarehouseValues[];

  /* El perfil del comprador. Vacio es "sin elegir". */
  legalNature: BuyerProfileValues['legalNature'];
  buyerActivity: BuyerProfileValues['buyerActivity'];
  ipsSector: BuyerProfileValues['ipsSector'];
  activityOther: string;
}

/* Los campos que se escriben; las listas y los contactos van por su lado. */
type TextField = Exclude<
  keyof OrganizationFormValues,
  | 'activityLines'
  | 'contacts'
  | 'customAreas'
  | 'warehouses'
  | 'delivery'
  | 'deliveryTimes'
  | 'shippingCosts'
  | 'orderEmails'
  | 'legalNature'
  | 'buyerActivity'
  | 'ipsSector'
  | 'earlyPayment'
  | 'electronicInvoicing'
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
  /* La subseccion que se ve. El formulario es uno solo y guarda todas a la
     vez: lo escrito en una pestaña no se pierde al pasar a otra. */
  tab: CompanyTab;
  /* Para llevar a la pestaña donde quedo un error al guardar. */
  onTabChange: (tab: CompanyTab) => void;
}

/* Un contacto a medias no sirve: sin area no se sabe de que se le habla, sin
   nombre no se sabe a quien se busca, y sin correo no hay como escribirle. Uno
   entero en blanco si vale: es el que aparece de entrada y nadie lleno. Comun
   a proveedor y comprador. */
const contactErrorsOf = (
  contacts: ContactValues[],
  /* Del proveedor: quien cubre un area obligatoria necesita celular. */
  celularObligatorio = false,
): Record<number, string> => {
  const errors: Record<number, string> = {};
  contacts.forEach((contact, index) => {
    if (isContactEmpty(contact)) return;
    const sinArea = contact.areas.length === 0 && contact.customAreas.length === 0;
    if (sinArea || !contact.name.trim() || !contact.email.trim()) {
      errors[index] = 'Para guardar este contacto faltan al menos un área, el nombre y el correo.';
    } else if (!isEmail(contact.email.trim())) {
      errors[index] = 'El correo no es válido.';
    } else if (
      celularObligatorio &&
      !contact.phone.trim() &&
      contact.areas.some((area) => !MULTI_CONTACT_AREAS.includes(area))
    ) {
      errors[index] = 'Falta el celular: Suminia lo necesita para coordinar con cada área.';
    } else if (contact.phone.trim() && !isColombianMobile(contact.phone)) {
      errors[index] = 'El celular debe tener 10 dígitos y empezar por 3, por ejemplo 300 123 4567.';
    }
  });
  return errors;
};

const toValues = (organization: Organization): OrganizationFormValues => ({
  name: organization.name,
  email: organization.email,
  phone: organization.phone ?? '',
  address: organization.address ?? '',
  /* Una ciudad escrita a mano antes de la lista se lleva a ella si se
     reconoce; si no, queda por elegir. */
  ...resolvePlace(organization.city, organization.department),
  minOrderValue: organization.minOrderValue === null ? '' : String(organization.minOrderValue),
  delivery: toDeliveryValues(organization.deliveryDaysMin, organization.deliveryDaysMax),
  deliveryTimes: toCityDeliveryValues(organization.deliveryTimes),
  freeShippingFrom:
    organization.freeShippingFrom == null ? '' : String(organization.freeShippingFrom),
  shippingCost: organization.shippingCost == null ? '' : String(organization.shippingCost),
  shippingCosts: toCityShippingValues(organization.shippingCosts),
  earlyPayment:
    organization.offersEarlyPaymentDiscount == null
      ? ''
      : organization.offersEarlyPaymentDiscount
        ? 'yes'
        : 'no',
  earlyPaymentRate:
    organization.earlyPaymentDiscountRate == null
      ? ''
      : String(organization.earlyPaymentDiscountRate),
  earlyPaymentDays:
    organization.earlyPaymentDiscountDays == null
      ? ''
      : String(organization.earlyPaymentDiscountDays),
  bankName: organization.bankName ?? '',
  bankAccountType: organization.bankAccountType ?? '',
  bankAccountNumber: organization.bankAccountNumber ?? '',
  bankAccountHolder: organization.bankAccountHolder ?? '',
  bankAccountHolderTaxId: organization.bankAccountHolderTaxId ?? '',
  breBKey: organization.breBKey ?? '',
  paymentCondition:
    organization.paymentTermDays == null
      ? ''
      : organization.paymentTermDays === 0
        ? 'cash'
        : 'credit',
  paymentTermDays:
    organization.paymentTermDays == null || organization.paymentTermDays === 0
      ? ''
      : String(organization.paymentTermDays),
  /* Un perfil de antes de la relacion trae solo las dos listas sueltas: cada
     actividad arranca con todas las lineas, para que el proveedor las afine. */
  activityLines:
    organization.activityLines && organization.activityLines.length > 0
      ? organization.activityLines
      : (organization.activities ?? []).map((activity) => ({
          activity,
          productLines: organization.productLines ?? [],
        })),
  exporter:
    organization.exporter === null || organization.exporter === undefined
      ? ''
      : organization.exporter
        ? 'yes'
        : 'no',
  electronicInvoicing:
    organization.issuesElectronicInvoices == null
      ? ''
      : organization.issuesElectronicInvoices
        ? 'yes'
        : 'no',
  contacts: toContactsValues(organization.contacts),
  customAreas: [
    ...new Set([
      ...(organization.customContactAreas ?? []),
      ...(organization.contacts ?? [])
        .filter((contact) => contact.area === 'OTHER' && contact.customArea)
        .map((contact) => contact.customArea as string),
    ]),
  ],
  warehouses: toWarehouseValues(organization.warehouses),
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
  tab,
  onTabChange,
}: OrganizationFormProps) => {
  const show = (target: CompanyTab) => tab === target;

  /* El estado inicial se toma una sola vez. Para recoger los datos frescos tras
     guardar, quien renderiza este formulario le pasa una `key` que cambia con
     updatedAt: React lo remonta y vuelve a leer las props. Es preferible a
     sincronizar con un efecto, que provoca un render en cascada. */
  const [values, setValues] = useState<OrganizationFormValues>(() => toValues(organization));

  /* El paso a seguir para cambiar NIT o razon social. Se muestra al pedirlo y
     no siempre: es un tramite raro, y el aviso permanente sugeriria que hay
     algo que corregir. */
  const [showLegalChange, setShowLegalChange] = useState(false);

  /* "Otro" en la lista de bancos no es un banco: abre el campo para escribirlo.
     Hace falta aparte del nombre porque recien elegido el nombre esta vacio, y
     vacio tambien es "sin elegir". */
  const [otherBank, setOtherBank] = useState(
    () => Boolean(organization.bankName) && !isListedBank(organization.bankName ?? ''),
  );

  const [contactErrors, setContactErrors] = useState<Record<number, string>>({});
  const [orderEmailErrors, setOrderEmailErrors] = useState<Record<number, string>>({});
  const [warehouseErrors, setWarehouseErrors] = useState<Record<number, string>>({});
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [cityDeliveryErrors, setCityDeliveryErrors] = useState<Record<number, string>>({});
  const [cityShippingErrors, setCityShippingErrors] = useState<Record<number, string>>({});
  const [earlyPaymentError, setEarlyPaymentError] = useState<string | null>(null);
  const [paymentTermError, setPaymentTermError] = useState<string | null>(null);
  const [activityLinesError, setActivityLinesError] = useState<string | null>(null);

  const handleChange =
    (field: TextField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
    };

  /* Otro departamento deja la ciudad por elegir: la de antes no esta en su
     lista. */
  const cambiarDepartamento = (department: string) =>
    setValues((current) => ({ ...current, department, city: '' }));
  const cambiarCiudad = (city: string) => setValues((current) => ({ ...current, city }));
  const claseLugar = (valor: string) =>
    `form-control${avisoDe(pendientes, 'city') && !valor ? ' is-missing' : ''}`;

  /* Marcar una actividad la agrega sin lineas; desmarcarla se lleva las
     suyas. */
  const toggleActivity = (activity: SupplierActivity) => () => {
    setValues((current) => ({
      ...current,
      activityLines: current.activityLines.some((l) => l.activity === activity)
        ? current.activityLines.filter((l) => l.activity !== activity)
        : [...current.activityLines, { activity, productLines: [] }],
    }));
    setActivityLinesError(null);
  };

  const toggleLine = (activity: SupplierActivity, line: SupplierProductLine) => () => {
    setValues((current) => ({
      ...current,
      activityLines: current.activityLines.map((l) =>
        l.activity !== activity
          ? l
          : {
              ...l,
              productLines: l.productLines.includes(line)
                ? l.productLines.filter((item) => item !== line)
                : [...l.productLines, line],
            },
      ),
    }));
    setActivityLinesError(null);
  };

  /* Un contacto a medias no sirve: sin area no se sabe de que se le habla, sin
     nombre no se sabe a quien se busca, y sin correo no hay como escribirle. Un
     contacto entero en blanco si vale: es el que aparece de entrada y nadie
     lleno.

     Que falten areas no impide guardar: el formulario guarda tambien la cuenta
     y lo demas, y frenarlo todo por un contacto seria peor. Lo que falta queda
     como pendiente en el panel y en el Resumen. */
  /* Devuelve la pestaña del primer error, en el orden de las pestañas, o null
     si se puede guardar. */
  const validateSupplierFields = (): CompanyTab | null => {
    const nextContactErrors = contactErrorsOf(values.contacts, true);

    /* Una actividad marcada sin lineas no dice nada: que fabrica, que importa. */
    const sinLineas = ACTIVITY_OPTIONS.filter((option) =>
      values.activityLines.some((l) => l.activity === option.value && l.productLines.length === 0),
    ).map((option) => option.label.toLowerCase());
    const nextActivityLinesError =
      sinLineas.length > 0
        ? `Elige qué líneas manejas como ${sinLineas.join(' y como ')}.`
        : null;

    /* Una bodega a medias no sirve para llegar: sin direccion o sin ciudad,
       nadie sabe a donde ir. Una en blanco se ignora. */
    const nextWarehouseErrors: Record<number, string> = {};
    values.warehouses.forEach((warehouse, index) => {
      if (isWarehouseEmpty(warehouse)) return;
      if (!warehouse.address.trim() || !warehouse.city) {
        nextWarehouseErrors[index] = 'Indica la dirección y la ciudad de esta bodega.';
      }
    });

    const nextOrderEmailErrors: Record<number, string> = {};
    values.orderEmails.forEach((email, index) => {
      if (email.trim() && !isEmail(email.trim())) {
        nextOrderEmailErrors[index] = 'El correo no es válido.';
      }
    });

    const nextDeliveryError = deliveryErrorOf(values.delivery);

    /* Cada ciudad, con su nombre y su tiempo, y una sola vez: con dos tiempos
       para la misma, el comprador no sabria cual vale. La ciudad sale de la
       lista, de modo que el par departamento y ciudad la identifica. */
    const nextCityDeliveryErrors: Record<number, string> = {};
    const seenCities = new Set<string>();
    values.deliveryTimes.forEach((value, index) => {
      if (isCityDeliveryEmpty(value)) return;
      const key = value.city && `${value.department}|${value.city}`;
      const error = !key ? 'Indica la ciudad.' : deliveryErrorOf(value.delivery);
      if (error) {
        nextCityDeliveryErrors[index] = error;
      } else if (seenCities.has(key)) {
        nextCityDeliveryErrors[index] = `${value.city} ya está en la lista.`;
      }
      seenCities.add(key);
    });

    /* Igual con el envio por ciudad: cada una con su costo, y una vez. */
    const nextCityShippingErrors: Record<number, string> = {};
    const seenShipping = new Set<string>();
    values.shippingCosts.forEach((value, index) => {
      if (isCityShippingEmpty(value)) return;
      const key = value.city && `${value.department}|${value.city}`;
      if (!key) {
        nextCityShippingErrors[index] = 'Indica la ciudad.';
      } else if (value.cost.trim() === '' || !(Number(value.cost) >= 0)) {
        nextCityShippingErrors[index] = 'Indica el costo de envío.';
      } else if (seenShipping.has(key)) {
        nextCityShippingErrors[index] = `${value.city} ya está en la lista.`;
      }
      seenShipping.add(key);
    });

    const plazo = values.paymentCondition === 'credit' ? values.paymentTermDays.trim() : '';
    let nextPaymentTermError: string | null = null;
    /* Sin elegir no es un error al guardar: el formulario guarda todas las
       pestañas a la vez, y exigirla aqui impedia guardar los contactos de un
       proveedor que aun no la ha definido. Es requisito para aprobarlo, y lo
       dice el progreso del registro. */
    if (
      values.paymentCondition === 'credit' &&
      !(plazo !== '' && Number.isInteger(Number(plazo)) && Number(plazo) >= 1 && Number(plazo) <= 365)
    ) {
      nextPaymentTermError = 'Indica el plazo del crédito en días, entre 1 y 365.';
    }

    /* Si ofrece pronto pago, el porcentaje y los dias son lo que lo define, y
       los dias tienen que caer antes del plazo neto: si no, no es pronto. */
    let nextEarlyPaymentError: string | null = null;
    if (values.earlyPayment === 'yes') {
      const tasa = Number(values.earlyPaymentRate);
      const dias = Number(values.earlyPaymentDays);
      if (values.paymentCondition === 'cash') {
        nextEarlyPaymentError = 'El descuento por pronto pago aplica solo a la venta a crédito.';
      } else if (!values.earlyPaymentRate.trim() || !(tasa > 0 && tasa <= 100)) {
        nextEarlyPaymentError = 'Indica el porcentaje del descuento, entre 0 y 100.';
      } else if (!values.earlyPaymentDays.trim() || !(Number.isInteger(dias) && dias >= 1)) {
        nextEarlyPaymentError = 'Indica en cuántos días hay que pagar para tener el descuento.';
      } else if (plazo !== '' && nextPaymentTermError === null && dias >= Number(plazo)) {
        nextEarlyPaymentError = `Los días del pronto pago deben ser menos que el plazo neto (${plazo} días).`;
      }
    }

    setContactErrors(nextContactErrors);
    setOrderEmailErrors(nextOrderEmailErrors);
    setWarehouseErrors(nextWarehouseErrors);
    setDeliveryError(nextDeliveryError);
    setCityDeliveryErrors(nextCityDeliveryErrors);
    setCityShippingErrors(nextCityShippingErrors);
    setEarlyPaymentError(nextEarlyPaymentError);
    setPaymentTermError(nextPaymentTermError);
    setActivityLinesError(nextActivityLinesError);
    if (Object.keys(nextWarehouseErrors).length > 0 || nextActivityLinesError !== null) {
      return 'empresa';
    }
    if (
      Object.keys(nextContactErrors).length > 0 ||
      Object.keys(nextOrderEmailErrors).length > 0
    ) {
      return 'contacto';
    }
    if (
      nextDeliveryError !== null ||
      Object.keys(nextCityDeliveryErrors).length > 0 ||
      Object.keys(nextCityShippingErrors).length > 0 ||
      nextPaymentTermError !== null ||
      nextEarlyPaymentError !== null
    ) {
      return 'condiciones';
    }
    return null;
  };

  const [buyerErrors, setBuyerErrors] = useState<BuyerProfileErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* El error puede estar en otra pestaña: se lleva alli, o el boton
       pareceria no hacer nada. */
    if (showSupplierFields) {
      const conError = validateSupplierFields();
      if (conError) {
        /* Se dice donde esta el error: saltar de pestaña sin explicacion
           parecia que el boton llevaba al siguiente paso sin guardar. */
        if (conError !== tab) {
          toast.error(`Revisa los campos marcados en ${TAB_TITLE[conError]} antes de guardar.`);
        }
        onTabChange(conError);
        return;
      }
    }
    if (!showSupplierFields) {
      const erroresContacto = contactErrorsOf(values.contacts);
      setContactErrors(erroresContacto);
      const errores = validateBuyerProfile(values);
      setBuyerErrors(errores);
      if (Object.keys(erroresContacto).length > 0) {
        onTabChange('contacto');
        return;
      }
      if (Object.keys(errores).length > 0) {
        onTabChange('perfil');
        return;
      }
    }
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Un panel por asunto, y cada uno dice para que sirve lo que pide. Antes
          eran cuatro `box-head` sobre el fondo gris, con los campos flotando
          debajo: el formulario no tenia ni principio ni final, y nada ataba un
          grupo de campos a su titulo. */}
      {show('empresa') && (
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
      )}

      {show('documentos') && legalDocuments}

      {/* Del lado del proveedor, lo que identifica a la empresa va aparte de
          las personas de contacto: el correo y el telefono generales los
          reemplazan los contactos por area. El comprador sigue como estaba. */}
      {/* Primero de lo que llena el proveedor, como en la hoja de Suminia: si
          la respuesta es no, lo demas no lleva a ninguna parte. No se pregunta
          en el registro porque ahi solo se crea la cuenta; esto es parte de lo
          que Suminia revisa para aprobar. */}
      {showSupplierFields && show('empresa') && (
        <Panel
          id={SECTION.electronicInvoicing}
          warning={avisoDe(pendientes, 'electronicInvoicing')}
          title='Facturación electrónica'
          description='Para garantizar la trazabilidad y facilitar la gestión de las operaciones comerciales, Suminia requiere que sus proveedores emitan facturas electrónicas.'
        >
          <fieldset>
            <legend className='form-label'>
              ¿Tu empresa está habilitada para expedir factura electrónica de venta validada por la
              DIAN?
            </legend>
            <div className='yes-no'>
              {(
                [
                  { value: 'yes', label: 'Sí' },
                  { value: 'no', label: 'No' },
                ] as const
              ).map((option) => (
                <div className='form-check' key={option.value}>
                  <input
                    id={`factura-electronica-${option.value}`}
                    type='radio'
                    name='factura-electronica'
                    className='form-check-input'
                    checked={values.electronicInvoicing === option.value}
                    onChange={() =>
                      setValues((current) => ({ ...current, electronicInvoicing: option.value }))
                    }
                  />
                  <label className='form-check-label' htmlFor={`factura-electronica-${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          {/* Se dice en cuanto marca "no", sin esperar a guardar. */}
          {values.electronicInvoicing === 'no' && (
            <div className='alert alert-warning mt-3 mb-0' role='status'>
              Por políticas internas, Suminia requiere que sus proveedores estén habilitados para
              expedir factura electrónica de venta validada por la DIAN. Sin ella no podemos aprobar
              tu empresa.
            </div>
          )}
        </Panel>
      )}

      {show('empresa') && (showSupplierFields ? (
        <Panel
          id={SECTION.info}
          warning={avisoDe(pendientes, 'city')}
          title='Información de la empresa'
          description='Cómo se llama tu empresa en Suminia y dónde está su oficina principal.'
        >
          <div className='form-grid'>
            <div className='form-grid-full'>
              <label className='form-label' htmlFor='empresa-nombre'>Nombre comercial</label>
              <input
                id='empresa-nombre'
                type='text'
                className='form-control'
                value={values.name}
                onChange={handleChange('name')}
              />
            </div>
            {/* "Oficina principal" y no "desde donde opera": una empresa puede
                tener oficinas pequeñas en varias ciudades, y lo que interesa
                es su sede. */}
            <div>
              <label className='form-label' htmlFor='empresa-departamento'>
                Departamento de la oficina principal
              </label>
              <DepartmentSelect
                id='empresa-departamento'
                className={claseLugar(values.department)}
                value={values.department}
                onChange={cambiarDepartamento}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='empresa-ciudad'>
                Ciudad de la oficina principal
              </label>
              <CitySelect
                id='empresa-ciudad'
                className={claseLugar(values.city)}
                department={values.department}
                value={values.city}
                onChange={cambiarCiudad}
              />
            </div>
            <div className='form-grid-full'>
              <label className='form-label' htmlFor='empresa-direccion'>
                Dirección de la oficina principal
              </label>
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
        /* Lo que identifica a la empresa, aparte de las personas: estas van
           en su propia subseccion, Contactos. */
        <Panel
          id={SECTION.info}
          title='Información de la empresa'
          description='Cómo se llama tu organización, dónde está y cómo comunicarse con ella.'
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
              <label className='form-label' htmlFor='empresa-correo'>Correo de la empresa</label>
              <input
                id='empresa-correo'
                type='email'
                className='form-control'
                value={values.email}
                onChange={handleChange('email')}
              />
            </div>
            <div className='form-grid-full'>
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
              <label className='form-label' htmlFor='empresa-departamento'>Departamento</label>
              <DepartmentSelect
                id='empresa-departamento'
                className={claseLugar(values.department)}
                value={values.department}
                onChange={cambiarDepartamento}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='empresa-ciudad'>Ciudad</label>
              <CitySelect
                id='empresa-ciudad'
                className={claseLugar(values.city)}
                department={values.department}
                value={values.city}
                onChange={cambiarCiudad}
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
      ))}

      {/* Junto a la oficina principal: las dos dicen donde esta la empresa,
          una la sede y la otra la mercancia. */}
      {showSupplierFields && show('empresa') && (
        <SupplierWarehousesFields
          warehouses={values.warehouses}
          errors={warehouseErrors}
          onChange={(warehouses) => setValues((current) => ({ ...current, warehouses }))}
          organizationId={organization.id}
          documents={organization.documents ?? []}
        />
      )}

      {/* Las personas del comprador: las mismas tarjetas del proveedor, con
          sus areas. Sin cargo, porque el area ya lo dice, y con los
          auxiliares de compras, que pueden ser varios. */}
      {!showSupplierFields && show('contacto') && (
        <ContactPeopleFields
          areaOptions={BUYER_CONTACT_AREA_OPTIONS}
          multiAreas={MULTI_CONTACT_AREAS}
          showPosition={false}
          description='Las personas de tu organización con las que Suminia coordina compras, pagos y entregas. Una misma persona puede encargarse de varias áreas, y puedes añadir todos los auxiliares de compras que tengas.'
          warning={avisoDe(pendientes, 'contacts')}
          contacts={values.contacts}
          customAreas={values.customAreas}
          onCustomAreasChange={(customAreas) =>
            setValues((current) => ({ ...current, customAreas }))
          }
          errors={contactErrors}
          onChange={(contacts) => setValues((current) => ({ ...current, contacts }))}
        />
      )}

      {!showSupplierFields && show('perfil') && (
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
          {show('empresa') && (
          <Panel
            id={SECTION.profile}
            warning={avisoDe(pendientes, 'profile')}
            title='Perfil comercial'
            description='Define las actividades y líneas de productos de tu empresa para facilitar su visibilidad ante compradores potenciales.'
          >
            <div className='form-grid'>
              {/* Una fila por actividad y, frente a cada una, las lineas que
                  maneja en ella: una misma empresa puede fabricar mobiliario,
                  importar dispositivos y distribuir reactivos. Dos listas
                  sueltas no decian que hacia con cada cosa. */}
              <fieldset className='form-grid-full'>
                <legend className='form-label'>
                  ¿Qué actividades realizas y con qué líneas de productos?
                </legend>
                <ul className='activity-lines'>
                  {ACTIVITY_OPTIONS.map((option) => {
                    const entrada = values.activityLines.find((l) => l.activity === option.value);
                    return (
                      <li key={option.value} className={entrada ? 'is-on' : undefined}>
                        <div className='form-check'>
                          <input
                            id={`empresa-actividad-${option.value}`}
                            type='checkbox'
                            className='form-check-input'
                            checked={Boolean(entrada)}
                            onChange={toggleActivity(option.value)}
                          />
                          <label
                            className='form-check-label'
                            htmlFor={`empresa-actividad-${option.value}`}
                          >
                            {option.label}
                          </label>
                        </div>
                        {entrada ? (
                          <div className='activity-lines-options'>
                            {PRODUCT_LINE_OPTIONS.map((line) => {
                              const marcada = entrada.productLines.includes(line.value);
                              return (
                                <button
                                  type='button'
                                  key={line.value}
                                  aria-pressed={marcada}
                                  className={marcada ? 'is-on' : undefined}
                                  onClick={toggleLine(option.value, line.value)}
                                >
                                  {line.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <small className='font-light'>
                            Márcala para elegir sus líneas de productos.
                          </small>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {activityLinesError ? (
                  <small className='text-danger'>{activityLinesError}</small>
                ) : (
                  <small className='font-light'>
                    Puedes marcar varias actividades y varias líneas en cada una.
                  </small>
                )}
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

            </div>
          </Panel>
          )}

          {show('contacto') && (
          <SupplierContactsFields
            contactsWarning={avisoDe(pendientes, 'contacts')}
            orderEmailsWarning={avisoDe(pendientes, 'orderEmails')}
            contacts={values.contacts}
            customAreas={values.customAreas}
            onCustomAreasChange={(customAreas) =>
              setValues((current) => ({ ...current, customAreas }))
            }
            orderEmails={values.orderEmails}
            contactErrors={contactErrors}
            orderEmailErrors={orderEmailErrors}
            onContactsChange={(contacts) => setValues((current) => ({ ...current, contacts }))}
            onOrderEmailsChange={(orderEmails) =>
              setValues((current) => ({ ...current, orderEmails }))
            }
          />
          )}

          {show('condiciones') && (
          <>
          {/* "Politicas" y no "condiciones": es como se dice en el sector. Y
              "monto" porque es un valor en pesos, no un numero de unidades. */}
          <Panel
            warning={avisoDe(pendientes, 'paymentTerms')}
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
              {/* Ocupa el ancho entero: debajo del general van las ciudades,
                  y cada una lleva su propio selector. */}
              <div className='form-grid-full'>
                <label className='form-label' htmlFor='empresa-entrega'>
                  Tiempo de entrega
                </label>
                <DeliveryTimeInput
                  id='empresa-entrega'
                  value={values.delivery}
                  onChange={(delivery) => setValues((current) => ({ ...current, delivery }))}
                />
                <small className='font-light'>
                  Cuánto tardas en entregar un pedido confirmado. Puede ser el mismo día, un
                  número de días o un rango. El comprador verá este tiempo en cada producto tuyo.
                </small>
                {deliveryError && <small className='text-danger'>{deliveryError}</small>}

                <span className='form-label d-block mt-3'>Tiempos por ciudad</span>
                <small className='font-light d-block mb-2'>
                  Si en alguna ciudad entregas en un tiempo distinto, añádela. En las demás vale
                  el tiempo de arriba.
                </small>
                <CityDeliveryTimesFields
                  values={values.deliveryTimes}
                  errors={cityDeliveryErrors}
                  onChange={(deliveryTimes) =>
                    setValues((current) => ({ ...current, deliveryTimes }))
                  }
                />
              </div>

              {/* El envio lo pone el proveedor: Suminia lo cobra con el pedido y
                  se lo pasa entero. */}
              <div>
                <label className='form-label' htmlFor='empresa-envio-gratis'>
                  Envío gratis desde
                </label>
                <input
                  id='empresa-envio-gratis'
                  type='number'
                  min={0}
                  step={1000}
                  className='form-control'
                  placeholder='No ofrezco envío gratis'
                  value={values.freeShippingFrom}
                  onChange={handleChange('freeShippingFrom')}
                />
                <small className='font-light'>
                  El monto del pedido, antes de IVA, desde el que no cobras envío. Déjalo vacío si
                  no ofreces envío gratis.
                </small>
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-envio'>
                  Costo de envío
                </label>
                <input
                  id='empresa-envio'
                  type='number'
                  min={0}
                  step={1000}
                  className='form-control'
                  placeholder='No cobro envío'
                  value={values.shippingCost}
                  onChange={handleChange('shippingCost')}
                />
                <small className='font-light'>
                  Lo que cobras por despachar un pedido que no llega al envío gratis, IVA incluido.
                  Déjalo vacío si no cobras envío.
                </small>
              </div>
              <div className='form-grid-full'>
                <span className='form-label d-block'>Costos de envío por ciudad</span>
                <small className='font-light d-block mb-2'>
                  Si a alguna ciudad el envío te cuesta distinto, añádela con su costo. En las
                  demás vale el de arriba, y el envío gratis aplica en todas.
                </small>
                <CityShippingCostsFields
                  values={values.shippingCosts}
                  errors={cityShippingErrors}
                  onChange={(shippingCosts) =>
                    setValues((current) => ({ ...current, shippingCosts }))
                  }
                />
              </div>

              {/* Va antes del pronto pago porque este se entiende contra el:
                  "2 % si paga en 15 días" dice algo solo si el plazo es 30. */}
              <fieldset className='form-grid-full'>
                <legend className='form-label'>Condición de pago</legend>
                <small className='font-light d-block mb-2'>
                  Aparece en cada orden de compra que te emite Suminia.
                </small>
                <div className='yes-no'>
                  {(
                    [
                      { value: 'cash', label: 'De contado' },
                      { value: 'credit', label: 'Crédito' },
                    ] as const
                  ).map((option) => (
                    <div className='form-check' key={option.value}>
                      <input
                        id={`condicion-pago-${option.value}`}
                        type='radio'
                        name='condicion-pago'
                        className='form-check-input'
                        checked={values.paymentCondition === option.value}
                        onChange={() =>
                          setValues((current) => ({ ...current, paymentCondition: option.value }))
                        }
                      />
                      <label className='form-check-label' htmlFor={`condicion-pago-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {values.paymentCondition !== 'credit' && paymentTermError && (
                  <small className='text-danger'>{paymentTermError}</small>
                )}
              </fieldset>

              {/* El plazo solo a credito: de contado no hay plazo que pedir. */}
              {values.paymentCondition === 'credit' && (
                <div>
                  <label className='form-label' htmlFor='empresa-plazo-neto'>
                    Plazo del crédito
                  </label>
                  <div className='delivery-days'>
                    <input
                      id='empresa-plazo-neto'
                      type='number'
                      min={1}
                      max={365}
                      className='form-control'
                      placeholder='30'
                      value={values.paymentTermDays}
                      onChange={handleChange('paymentTermDays')}
                    />
                    <span className='font-light'>días</span>
                  </div>
                  <small className='font-light'>Contados desde la fecha de la factura.</small>
                  {paymentTermError && <small className='text-danger'>{paymentTermError}</small>}
                </div>
              )}

              <fieldset className='form-grid-full'>
                <legend className='form-label'>¿Ofrece descuentos financieros por pronto pago?</legend>
                <div className='yes-no'>
                  {(
                    [
                      { value: 'yes', label: 'Sí' },
                      { value: 'no', label: 'No' },
                    ] as const
                  ).map((option) => (
                    <div className='form-check' key={option.value}>
                      <input
                        id={`pronto-pago-${option.value}`}
                        type='radio'
                        name='pronto-pago'
                        className='form-check-input'
                        checked={values.earlyPayment === option.value}
                        onChange={() =>
                          setValues((current) => ({ ...current, earlyPayment: option.value }))
                        }
                      />
                      <label className='form-check-label' htmlFor={`pronto-pago-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* El porcentaje y los dias solo si lo ofrece: a quien dice que
                  no, no se le pregunta cuanto. */}
              {values.earlyPayment === 'yes' && (
                <>
                  <div>
                    <label className='form-label' htmlFor='pronto-pago-porcentaje'>
                      Descuento (%)
                    </label>
                    <input
                      id='pronto-pago-porcentaje'
                      type='number'
                      min={0}
                      max={100}
                      step={0.5}
                      className='form-control'
                      placeholder='2'
                      value={values.earlyPaymentRate}
                      onChange={handleChange('earlyPaymentRate')}
                    />
                  </div>
                  <div>
                    <label className='form-label' htmlFor='pronto-pago-dias'>
                      Si paga dentro de (días)
                    </label>
                    <input
                      id='pronto-pago-dias'
                      type='number'
                      min={1}
                      max={365}
                      className='form-control'
                      placeholder='15'
                      value={values.earlyPaymentDays}
                      onChange={handleChange('earlyPaymentDays')}
                    />
                  </div>
                  {earlyPaymentError && (
                    <small className='text-danger form-grid-full'>{earlyPaymentError}</small>
                  )}
                </>
              )}
            </div>
          </Panel>

          <Panel
            id={SECTION.bank}
            warning={avisoDe(pendientes, 'bank')}
            title='Cuenta para recibir pagos'
            description='A dónde Suminia te consigna lo que corresponde a tus facturas.'
          >
            <div className='form-grid'>
              <div>
                <label className='form-label' htmlFor='empresa-banco'>Banco</label>
                <select
                  id='empresa-banco'
                  className='form-control'
                  value={otherBank ? OTHER_BANK : values.bankName}
                  onChange={(event) => {
                    const { value } = event.target;
                    setOtherBank(value === OTHER_BANK);
                    setValues((current) => ({
                      ...current,
                      bankName: value === OTHER_BANK ? '' : value,
                    }));
                  }}
                >
                  <option value=''>Elige el banco</option>
                  <optgroup label='Recomendados'>
                    {RECOMMENDED_BANKS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label='Otros bancos'>
                    {OTHER_BANKS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                    <option value={OTHER_BANK}>Otro</option>
                  </optgroup>
                </select>
                {otherBank && (
                  <input
                    id='empresa-banco-otro'
                    type='text'
                    className='form-control mt-2'
                    aria-label='Nombre del banco'
                    placeholder='Nombre del banco'
                    value={values.bankName}
                    onChange={handleChange('bankName')}
                  />
                )}
                <small className='font-light'>
                  Recomendados para agilizar los pagos: Bancolombia y Davivienda.
                </small>
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
                {/* Titular y NIT salen de los datos legales y no se editan: la
                    cuenta tiene que ser de la empresa. El backend los fija igual,
                    aunque se le mande otra cosa. */}
                <label className='form-label' htmlFor='empresa-titular'>Titular</label>
                <input
                  id='empresa-titular'
                  type='text'
                  className='form-control'
                  value={organization.legalName}
                  disabled
                  readOnly
                />
                <small className='font-light'>
                  El titular de la cuenta bancaria debe corresponder con la razón social, no se
                  permiten pagos a terceros.
                </small>
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-titular-nit'>NIT del titular</label>
                <input
                  id='empresa-titular-nit'
                  type='text'
                  className='form-control'
                  value={formatTaxId(organization.taxId)}
                  disabled
                  readOnly
                />
              </div>
              <div className='form-grid-full'>
                <label className='form-label' htmlFor='empresa-bre-b'>
                  Llave Bre-B (opcional)
                </label>
                <input
                  id='empresa-bre-b'
                  type='text'
                  maxLength={100}
                  className='form-control'
                  placeholder='NIT, correo o llave alfanumérica'
                  value={values.breBKey}
                  onChange={handleChange('breBKey')}
                />
                <small className='font-light'>
                  La llave asociada a esta misma cuenta, para facilitar los pagos inmediatos. La
                  cuenta y la llave se validan antes de usarlas para pagos de Suminia.
                </small>
              </div>
            </div>
          </Panel>
          </>
          )}
        </>
      )}

      {/* Un solo boton para todo el formulario, al final y fuera de los paneles:
          guarda todas las pestañas a la vez, de modo que colgarlo del pie de
          uno de ellos sugeriria que solo guarda ese. En Documentos no va:
          cada documento se sube al momento. */}
      {tab !== 'documentos' && (
        <div className='form-actions is-sticky'>
          <button type='submit' className='btn btn-primary' disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </form>
  );
};

export default OrganizationForm;

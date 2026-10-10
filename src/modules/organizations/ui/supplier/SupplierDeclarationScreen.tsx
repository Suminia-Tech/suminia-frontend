'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'react-toastify';

import { DATA_POLICY_PATH } from '@/shared/config/legal';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { PageHeader, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetSupplierQuery, useSaveSupplierDeclarationMutation } from '../../api/suppliersApi';
import {
  DATA_POLICY_TEXT,
  DECLARATION_TITLE,
  INTERNATIONAL_OPERATION_OPTIONS,
  LAWFUL_ORIGIN,
  LAWFUL_USE,
  LISTED_CURRENCIES,
  LISTS_AUTHORIZATION,
  MARKETING_TEXT,
  PEP_QUESTION,
  SUPPORT_EMAIL,
  TRUTHFUL_INFORMATION,
} from '../../lib/supplierDeclaration';
import type {
  InternationalOperationType,
  SupplierDeclaration,
} from '../../model/organization.types';
import type { Supplier } from '../../model/supplier.types';
import DeclarationSummaryPanel from '../common/DeclarationSummaryPanel';

/* La declaracion de autocontrol de riesgos (antes SAGRILAFT) que el proveedor
   firma para que Suminia lo apruebe.

   Se llena mientras la solicitud esta pendiente. Despues queda fija: Suminia
   aprobo sobre lo que ahi decia, y cambiarla por cuenta propia dejaria la
   aprobacion apoyada en algo distinto de lo que se reviso. El backend lo hace
   cumplir; aqui solo se evita ofrecer un formulario que acabaria en 403. */

type YesNo = '' | 'yes' | 'no';

interface DeclarationValues {
  lawfulOrigin: boolean;
  fundsOrigin: string;
  lawfulUse: boolean;
  listsAuthorization: boolean;
  truthfulInformation: boolean;
  isPep: YesNo;
  internationalOperations: YesNo;
  internationalOperationTypes: InternationalOperationType[];
  otherOperation: string;
  operationCountries: string;
  currencies: string[];
  otherCurrency: string;
  dataPolicy: boolean;
  marketingConsent: boolean;
}

type Errors = Partial<Record<keyof DeclarationValues, string>>;

const toYesNo = (value: boolean | undefined): YesNo =>
  value === undefined ? '' : value ? 'yes' : 'no';

/* Una declaracion ya enviada vuelve con las casillas marcadas: se aceptaron al
   enviarla, y volver a pedirlas al corregir un dato seria fingir que no. */
const toValues = (declaration: SupplierDeclaration | null | undefined): DeclarationValues => {
  const listed = (declaration?.currencies ?? []).filter((currency) =>
    (LISTED_CURRENCIES as readonly string[]).includes(currency),
  );
  const other = (declaration?.currencies ?? []).filter(
    (currency) => !(LISTED_CURRENCIES as readonly string[]).includes(currency),
  );

  return {
    lawfulOrigin: Boolean(declaration),
    fundsOrigin: declaration?.fundsOrigin ?? '',
    lawfulUse: Boolean(declaration),
    listsAuthorization: Boolean(declaration),
    truthfulInformation: Boolean(declaration),
    isPep: toYesNo(declaration?.isPep),
    internationalOperations: toYesNo(declaration?.internationalOperations),
    internationalOperationTypes: declaration?.internationalOperationTypes ?? [],
    otherOperation: declaration?.otherOperation ?? '',
    operationCountries: declaration?.operationCountries ?? '',
    currencies: listed,
    otherCurrency: other.join(', '),
    dataPolicy: Boolean(declaration),
    marketingConsent: declaration?.marketingConsent ?? false,
  };
};

const MUST_ACCEPT = 'Debes aceptar esta declaración para continuar.';

const validate = (values: DeclarationValues): Errors => {
  const errors: Errors = {};

  if (!values.lawfulOrigin) errors.lawfulOrigin = MUST_ACCEPT;
  if (!values.fundsOrigin.trim()) {
    errors.fundsOrigin = 'Indica de qué actividades provienen los recursos.';
  }
  if (!values.lawfulUse) errors.lawfulUse = MUST_ACCEPT;
  if (!values.listsAuthorization) errors.listsAuthorization = MUST_ACCEPT;
  if (!values.truthfulInformation) errors.truthfulInformation = MUST_ACCEPT;
  if (!values.isPep) errors.isPep = 'Responde sí o no.';
  if (!values.internationalOperations) errors.internationalOperations = 'Responde sí o no.';

  if (values.internationalOperations === 'yes') {
    if (values.internationalOperationTypes.length === 0) {
      errors.internationalOperationTypes = 'Marca qué tipo de operaciones realizas.';
    }
    if (values.internationalOperationTypes.includes('OTHER') && !values.otherOperation.trim()) {
      errors.otherOperation = 'Describe las otras operaciones.';
    }
    if (!values.operationCountries.trim()) {
      errors.operationCountries = 'Indica los principales países con los que operas.';
    }
    if (values.currencies.length === 0 && !values.otherCurrency.trim()) {
      errors.currencies = 'Indica las monedas que utilizas.';
    }
  }

  if (!values.dataPolicy) {
    errors.dataPolicy = 'Debes aceptar la política de tratamiento de datos para continuar.';
  }

  return errors;
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <small className='text-danger d-block'>{message}</small> : null;

/* Una declaracion que se acepta con una casilla: el titulo arriba, el texto
   completo debajo, y la casilla ata las dos cosas. */
const DeclarationCheck = ({
  id,
  title,
  text,
  checked,
  onChange,
  error,
}: {
  id: string;
  title: string;
  text: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) => (
  <div className='declaration-item'>
    <div className='form-check'>
      <input
        id={id}
        type='checkbox'
        className='form-check-input'
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label className='form-check-label' htmlFor={id}>
        <strong>{title}</strong>
        <span className='font-light d-block'>{text}</span>
      </label>
    </div>
    <FieldError message={error} />
  </div>
);

const YesNoField = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}) => (
  <div className='yes-no'>
    {(
      [
        { value: 'yes', label: 'Sí' },
        { value: 'no', label: 'No' },
      ] as const
    ).map((option) => (
      <div className='form-check' key={option.value}>
        <input
          id={`${name}-${option.value}`}
          type='radio'
          name={name}
          className='form-check-input'
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
        <label className='form-check-label' htmlFor={`${name}-${option.value}`}>
          {option.label}
        </label>
      </div>
    ))}
  </div>
);

const SupportLink = () => (
  <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Cambio en la declaración de autocontrol')}`}>
    {SUPPORT_EMAIL}
  </a>
);

const DeclarationForm = ({ supplier }: { supplier: Supplier }) => {
  const [values, setValues] = useState<DeclarationValues>(() => toValues(supplier.declaration));
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [save, { isLoading }] = useSaveSupplierDeclarationMutation();

  const set = <K extends keyof DeclarationValues>(field: K, value: DeclarationValues[K]) =>
    setValues((current) => ({ ...current, [field]: value }));

  const toggle = <K extends 'internationalOperationTypes' | 'currencies'>(
    field: K,
    option: DeclarationValues[K][number],
  ) =>
    setValues((current) => {
      const list = current[field] as DeclarationValues[K][number][];
      return {
        ...current,
        [field]: list.includes(option)
          ? list.filter((item) => item !== option)
          : [...list, option],
      };
    });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa los campos marcados antes de enviar.');
      return;
    }

    const international = values.internationalOperations === 'yes';
    const otherCurrencies = values.otherCurrency
      .split(',')
      .map((currency) => currency.trim().toUpperCase())
      .filter(Boolean);

    try {
      await save({
        supplierId: supplier.id,
        data: {
          lawfulOrigin: true,
          lawfulUse: true,
          listsAuthorization: true,
          truthfulInformation: true,
          dataPolicy: true,
          fundsOrigin: values.fundsOrigin.trim(),
          isPep: values.isPep === 'yes',
          internationalOperations: international,
          internationalOperationTypes: international ? values.internationalOperationTypes : [],
          otherOperation:
            international && values.internationalOperationTypes.includes('OTHER')
              ? values.otherOperation.trim()
              : null,
          operationCountries: international ? values.operationCountries.trim() : null,
          currencies: international ? [...values.currencies, ...otherCurrencies] : [],
          marketingConsent: values.marketingConsent,
        },
      }).unwrap();
      toast.success(supplier.declaration ? 'Declaración actualizada' : 'Declaración enviada');
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo enviar la declaración.'));
    }
  };

  const international = values.internationalOperations === 'yes';

  return (
    <form className='declaration-form' onSubmit={handleSubmit} noValidate>
      <div className='alert alert-info'>
        Suminia necesita esta declaración para aprobar tu empresa. Puedes corregirla
        mientras tu solicitud está en revisión; una vez aprobada, para cambiarla escribe
        a <SupportLink />.
      </div>

      <Panel title='Origen y uso de los recursos'>
        <DeclarationCheck
          id='declaracion-origen'
          title={LAWFUL_ORIGIN.title}
          text={LAWFUL_ORIGIN.text}
          checked={values.lawfulOrigin}
          onChange={(checked) => set('lawfulOrigin', checked)}
          error={errors.lawfulOrigin}
        />

        <div className='declaration-item'>
          <label className='form-label' htmlFor='declaracion-fondos'>
            <strong>Origen de fondos</strong>
          </label>
          <p className='font-light mb-2'>
            Los recursos o bienes que posee la empresa provienen de las siguientes
            actividades (detalle la ocupación, oficio, actividad o negocio):
          </p>
          <textarea
            id='declaracion-fondos'
            className='form-control'
            rows={3}
            maxLength={500}
            value={values.fundsOrigin}
            onChange={(event) => set('fundsOrigin', event.target.value)}
          />
          <FieldError message={errors.fundsOrigin} />
        </div>

        <DeclarationCheck
          id='declaracion-uso'
          title={LAWFUL_USE.title}
          text={LAWFUL_USE.text}
          checked={values.lawfulUse}
          onChange={(checked) => set('lawfulUse', checked)}
          error={errors.lawfulUse}
        />
      </Panel>

      <Panel title='Listas y veracidad de la información'>
        <DeclarationCheck
          id='declaracion-listas'
          title={LISTS_AUTHORIZATION.title}
          text={LISTS_AUTHORIZATION.text}
          checked={values.listsAuthorization}
          onChange={(checked) => set('listsAuthorization', checked)}
          error={errors.listsAuthorization}
        />
        <DeclarationCheck
          id='declaracion-veraz'
          title={TRUTHFUL_INFORMATION.title}
          text={TRUTHFUL_INFORMATION.text}
          checked={values.truthfulInformation}
          onChange={(checked) => set('truthfulInformation', checked)}
          error={errors.truthfulInformation}
        />
      </Panel>

      <Panel title='Personas Expuestas Políticamente (PEP)'>
        <fieldset>
          <legend className='form-label'>{PEP_QUESTION}</legend>
          <YesNoField name='declaracion-pep' value={values.isPep} onChange={(v) => set('isPep', v)} />
          <FieldError message={errors.isPep} />
        </fieldset>
      </Panel>

      <Panel title='Operaciones internacionales'>
        <div className='form-grid'>
          <fieldset className='form-grid-full'>
            <legend className='form-label'>
              ¿Realiza operaciones internacionales o en moneda extranjera?
            </legend>
            <YesNoField
              name='declaracion-internacional'
              value={values.internationalOperations}
              onChange={(v) => set('internationalOperations', v)}
            />
            <FieldError message={errors.internationalOperations} />
          </fieldset>

          {/* El detalle solo si opera afuera: a quien contesta "no" no se le
              pregunta con que paises. */}
          {international && (
            <>
              <fieldset className='form-grid-full'>
                <legend className='form-label'>¿Qué tipo de operaciones realiza?</legend>
                <div className='check-grid'>
                  {INTERNATIONAL_OPERATION_OPTIONS.map((option) => (
                    <div className='form-check' key={option.value}>
                      <input
                        id={`declaracion-operacion-${option.value}`}
                        type='checkbox'
                        className='form-check-input'
                        checked={values.internationalOperationTypes.includes(option.value)}
                        onChange={() => toggle('internationalOperationTypes', option.value)}
                      />
                      <label
                        className='form-check-label'
                        htmlFor={`declaracion-operacion-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <FieldError message={errors.internationalOperationTypes} />
              </fieldset>

              {values.internationalOperationTypes.includes('OTHER') && (
                <div className='form-grid-full'>
                  <label className='form-label' htmlFor='declaracion-otras'>
                    ¿Qué otras operaciones?
                  </label>
                  <input
                    id='declaracion-otras'
                    type='text'
                    className='form-control'
                    maxLength={255}
                    value={values.otherOperation}
                    onChange={(event) => set('otherOperation', event.target.value)}
                  />
                  <FieldError message={errors.otherOperation} />
                </div>
              )}

              <div className='form-grid-full'>
                <label className='form-label' htmlFor='declaracion-paises'>
                  Principales países con los que opera
                </label>
                <input
                  id='declaracion-paises'
                  type='text'
                  className='form-control'
                  maxLength={500}
                  placeholder='Estados Unidos, China, México'
                  value={values.operationCountries}
                  onChange={(event) => set('operationCountries', event.target.value)}
                />
                <FieldError message={errors.operationCountries} />
              </div>

              <fieldset className='form-grid-full'>
                <legend className='form-label'>Monedas utilizadas</legend>
                <div className='currency-row'>
                  {LISTED_CURRENCIES.map((currency) => (
                    <div className='form-check' key={currency}>
                      <input
                        id={`declaracion-moneda-${currency}`}
                        type='checkbox'
                        className='form-check-input'
                        checked={values.currencies.includes(currency)}
                        onChange={() => toggle('currencies', currency)}
                      />
                      <label
                        className='form-check-label'
                        htmlFor={`declaracion-moneda-${currency}`}
                      >
                        {currency}
                      </label>
                    </div>
                  ))}
                  <input
                    type='text'
                    className='form-control'
                    aria-label='Otras monedas'
                    placeholder='Otra (p. ej. CNY, MXN)'
                    value={values.otherCurrency}
                    onChange={(event) => set('otherCurrency', event.target.value)}
                  />
                </div>
                <FieldError message={errors.currencies} />
              </fieldset>
            </>
          )}
        </div>
      </Panel>

      <Panel title='Autorización para el tratamiento de datos personales'>
        <DeclarationCheck
          id='declaracion-datos'
          title='Política de Tratamiento de Datos'
          text={
            <>
              {DATA_POLICY_TEXT}{' '}
              {/* En otra pestaña: abrirla aqui perderia lo que ya se lleno. */}
              <a href={DATA_POLICY_PATH} target='_blank' rel='noreferrer'>
                Ver Política de Tratamiento de Datos
              </a>
            </>
          }
          checked={values.dataPolicy}
          onChange={(checked) => set('dataPolicy', checked)}
          error={errors.dataPolicy}
        />
        <DeclarationCheck
          id='declaracion-comunicaciones'
          title='Quiero recibir comunicaciones de Suminia'
          text={MARKETING_TEXT}
          checked={values.marketingConsent}
          onChange={(checked) => set('marketingConsent', checked)}
        />
      </Panel>

      {serverError && <div className='alert alert-danger'>{serverError}</div>}

      <div className='form-actions'>
        <button type='submit' className='btn btn-primary' disabled={isLoading}>
          {isLoading
            ? 'Enviando...'
            : supplier.declaration
              ? 'Actualizar declaración'
              : 'Enviar declaración'}
        </button>
      </div>
    </form>
  );
};

export const SupplierDeclarationScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const organizationId = user?.organizationId ?? null;

  const { data, isLoading, isError, error } = useGetSupplierQuery(organizationId as string, {
    skip: !organizationId,
  });

  const header = (
    <PageHeader
      title='Declaración de autocontrol'
      description={`${DECLARATION_TITLE} (anteriormente SAGRILAFT).`}
    />
  );

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (!organizationId) {
    return <div className='alert alert-secondary'>Tu cuenta no está asociada a ninguna empresa.</div>;
  }

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar la declaración.')}
      </div>
    );
  }

  const supplier = data.data;

  if (supplier.status === 'PENDING') {
    return (
      <>
        {header}
        {/* La key remonta el formulario con lo guardado tras enviarlo. */}
        <DeclarationForm key={supplier.declaration?.updatedAt ?? 'nueva'} supplier={supplier} />
      </>
    );
  }

  return (
    <>
      {header}
      <div className='alert alert-secondary'>
        Tu empresa ya fue revisada con esta declaración. Para cambiar algo, escribe a{' '}
        <SupportLink /> contándonos qué hay que modificar.
      </div>
      {supplier.declaration ? (
        <DeclarationSummaryPanel
          declaration={supplier.declaration}
          title='Lo que declaraste'
        />
      ) : (
        <Panel title='Sin declaración registrada'>
          <p className='font-light mb-0'>
            Tu empresa se aprobó antes de que Suminia pidiera esta declaración. Escríbenos a{' '}
            <SupportLink /> para completarla.
          </p>
        </Panel>
      )}
    </>
  );
};

export default SupplierDeclarationScreen;

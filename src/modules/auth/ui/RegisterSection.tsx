'use client';

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Col, Input, Row } from 'reactstrap';

import { LOGINMODAL } from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { OTHER_BANKS, RECOMMENDED_BANKS } from '@/shared/lib/banks';
import {
  BUYER_ACTIVITY_OPTIONS,
  IPS_SECTOR_OPTIONS,
  LEGAL_NATURE_OPTIONS,
  type BuyerActivity,
  type IpsSector,
  type LegalNature,
} from '@/shared/lib/buyerProfile';
import { isNitBase, nitCheckDigit, withCheckDigit } from '@/shared/lib/nit';
import { isEmail } from '@/shared/lib/validators';
import { CitySelect, DepartmentSelect, PasswordToggle, SubmitButton } from '@/shared/ui';
import { useAppDispatch } from '@/store/hooks';

import { useRegisterMutation } from '../api/authApi';
import { authLabels } from '../lib/labels';
import { validatePasswordFields } from '../lib/passwordForm';
import type { OrganizationType } from '../model/auth.types';

interface RegisterForm {
  organizationType: OrganizationType;
  taxId: string;
  legalName: string;
  organizationName: string;
  organizationEmail: string;
  organizationPhone: string;
  organizationAddress: string;
  department: string;
  city: string;
  /* Del comprador: quien es y con que cuenta paga. */
  legalNature: LegalNature | '';
  buyerActivity: BuyerActivity | '';
  ipsSector: IpsSector | '';
  activityOther: string;
  bankName: string;
  bankAccountNumber: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM: RegisterForm = {
  organizationType: 'BUYER',
  taxId: '',
  legalName: '',
  organizationName: '',
  organizationEmail: '',
  organizationPhone: '',
  organizationAddress: '',
  department: '',
  city: '',
  legalNature: '',
  buyerActivity: '',
  ipsSector: '',
  activityOther: '',
  bankName: '',
  bankAccountNumber: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

const validate = (form: RegisterForm): FormErrors => {
  const errors: FormErrors = {};

  if (!form.taxId) errors.taxId = 'Ingresa el NIT de la empresa';
  else if (!isNitBase(form.taxId))
    errors.taxId = 'El NIT va sin puntos ni dígito de verificación: de 6 a 10 cifras';
  if (!form.legalName.trim()) errors.legalName = 'Ingresa la razón social';
  if (!form.organizationName.trim()) errors.organizationName = 'Ingresa el nombre comercial';

  if (!form.organizationEmail.trim()) errors.organizationEmail = 'Ingresa el correo de la empresa';
  else if (!isEmail(form.organizationEmail))
    errors.organizationEmail = 'El correo no tiene un formato válido';

  /* Telefono, direccion y ciudad son obligatorios: con ellos Suminia
     identifica a la empresa ante un control y la contacta para lo comercial.
     Fijo o celular, de 7 a 15 cifras; los espacios y guiones no cuentan. */
  const cifras = form.organizationPhone.replace(/\D/g, '').length;
  if (!form.organizationPhone.trim()) errors.organizationPhone = 'Ingresa el teléfono de la empresa';
  else if (!/^\+?[\d\s().-]+$/.test(form.organizationPhone.trim()) || cifras < 7 || cifras > 15)
    errors.organizationPhone = 'El teléfono debe tener entre 7 y 15 dígitos';

  if (!form.organizationAddress.trim())
    errors.organizationAddress = 'Ingresa la dirección de la empresa';
  if (!form.department) errors.department = 'Elige el departamento';
  if (!form.city) errors.city = 'Elige la ciudad';

  /* El comprador no termina el registro sin decir quien es y con que cuenta
     paga: sin ello Suminia no puede aprobarlo. */
  if (form.organizationType === 'BUYER') {
    if (!form.legalNature) errors.legalNature = 'Elige la naturaleza de tu organización';
    if (!form.buyerActivity) errors.buyerActivity = 'Elige la actividad';
    if (form.buyerActivity === 'IPS' && !form.ipsSector)
      errors.ipsSector = 'Indica si la IPS es pública, mixta o privada';
    if (form.buyerActivity === 'OTHER' && !form.activityOther.trim())
      errors.activityOther = 'Describe la actividad';
    if (!form.bankName) errors.bankName = 'Elige el banco con el que pagas';
    if (!form.bankAccountNumber.trim()) errors.bankAccountNumber = 'Escribe el número de cuenta';
  }

  if (!form.name.trim()) errors.name = 'Ingresa tu nombre';

  if (!form.email.trim()) errors.email = 'Ingresa tu correo electrónico';
  else if (!isEmail(form.email)) errors.email = 'El correo no tiene un formato válido';

  return { ...errors, ...validatePasswordFields(form) };
};

/* Cada campo ocupa media fila en escritorio y la fila completa en movil. */
const Field = ({
  error,
  half = true,
  children,
}: {
  error?: string;
  half?: boolean;
  children: ReactNode;
}) => (
  <Col md={half ? 6 : 12}>
    <div className='input'>
      {children}
      <span className='spin'></span>
      {error && <small className='text-danger d-block mt-1'>{error}</small>}
    </div>
  </Col>
);

const RegisterSection = () => {
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<{ email: string; company: string } | null>(null);
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });

  const toggleVisible = (field: 'password' | 'confirmPassword') => () =>
    setVisible((current) => ({ ...current, [field]: !current[field] }));

  const handleChange =
    (field: keyof RegisterForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setGeneralError(null);
    };

  /* Cambia varios campos a la vez y limpia sus errores: elegir otra
     naturaleza vacia la actividad, que depende de ella. */
  const cambiar = (patch: Partial<RegisterForm>) => {
    setForm((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      (Object.keys(patch) as (keyof RegisterForm)[]).forEach((key) => delete next[key]);
      return next;
    });
    setGeneralError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register({
        organizationType: form.organizationType,
        taxId: withCheckDigit(form.taxId),
        legalName: form.legalName.trim(),
        organizationName: form.organizationName.trim(),
        organizationEmail: form.organizationEmail.trim(),
        organizationPhone: form.organizationPhone.trim(),
        organizationAddress: form.organizationAddress.trim(),
        city: form.city,
        department: form.department,
        ...(form.organizationType === 'BUYER' && {
          legalNature: form.legalNature || undefined,
          buyerActivity: form.buyerActivity || undefined,
          ipsSector: form.buyerActivity === 'IPS' ? form.ipsSector || undefined : undefined,
          activityOther:
            form.buyerActivity === 'OTHER' ? form.activityOther.trim() : undefined,
          bankName: form.bankName,
          bankAccountNumber: form.bankAccountNumber.trim(),
        }),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      setRegistered({ email: form.email.trim(), company: form.organizationName.trim() });
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      setErrors(fieldErrors as FormErrors);

      if (Object.keys(fieldErrors).length === 0) {
        setGeneralError(
          extractErrorMessage(error, 'No se pudo completar el registro. Intenta de nuevo.'),
        );
      }
    }
  };

  if (registered) {
    return (
      <div className='login-section register-section'>
        <div className='materialContainer'>
          <div className='box'>
            <div className='login-title'>
              <h2>Revisa tu correo</h2>
            </div>
            <p>
              Registramos a <strong>{registered.company}</strong> y enviamos un enlace de
              verificación a <strong>{registered.email}</strong>. Ábrelo para activar tu cuenta.
            </p>
            <p className='text-muted'>El enlace caduca en 2 horas y solo se puede usar una vez.</p>
            <p className='text-muted'>
              Tu empresa queda pendiente de aprobación. Podrás iniciar sesión al verificar el correo,
              y operar cuando el equipo de Suminia valide los datos.
            </p>
            <p>
              <a
                className='theme-color'
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch(LOGINMODAL())}
              >
                {authLabels.alreadyHaveAccount}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='login-section register-section'>
      <div className='materialContainer'>
        <div className='box'>
          <div className='login-title'>
            <h2>{authLabels.register}</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <p className='form-section-title'>Datos de la empresa</p>
            <Row>
              <Field error={errors.organizationType} half={false}>
                <Input
                  type='select'
                  value={form.organizationType}
                  onChange={handleChange('organizationType')}
                >
                  <option value='BUYER'>Comprador (clínica, hospital, distribuidor)</option>
                  <option value='SUPPLIER'>Proveedor (fabricante, importador)</option>
                </Input>
              </Field>

              {/* El NIT sin puntos y, al lado, su digito de verificacion: lo
                  calcula la formula de la DIAN, de modo que no se escribe y no
                  se equivoca. Se guardan juntos, como en el RUT. */}
              <Field error={errors.taxId}>
                <div className='nit-field'>
                  <Input
                    type='text'
                    inputMode='numeric'
                    placeholder='NIT sin puntos ni dígito de verificación'
                    aria-label='NIT sin puntos ni dígito de verificación'
                    maxLength={10}
                    value={form.taxId}
                    onChange={(event) => {
                      const cifras = event.target.value.replace(/\D/g, '');
                      setForm((current) => ({ ...current, taxId: cifras }));
                      setErrors((current) => ({ ...current, taxId: undefined }));
                      setGeneralError(null);
                    }}
                    invalid={!!errors.taxId}
                  />
                  <Input
                    type='text'
                    className='nit-check-digit'
                    aria-label='Dígito de verificación'
                    title='Dígito de verificación, calculado con la fórmula de la DIAN'
                    placeholder='DV'
                    value={isNitBase(form.taxId) ? String(nitCheckDigit(form.taxId)) : ''}
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                {isNitBase(form.taxId) && (
                  <small className='font-light d-block mt-1'>
                    Dígito de verificación: {nitCheckDigit(form.taxId)}. Se calcula solo. NIT:{' '}
                    {withCheckDigit(form.taxId)}
                  </small>
                )}
              </Field>

              <Field error={errors.legalName}>
                <Input
                  type='text'
                  placeholder='Razón social'
                  value={form.legalName}
                  onChange={handleChange('legalName')}
                  invalid={!!errors.legalName}
                />
              </Field>

              <Field error={errors.organizationName}>
                <Input
                  type='text'
                  placeholder='Nombre comercial'
                  value={form.organizationName}
                  onChange={handleChange('organizationName')}
                  invalid={!!errors.organizationName}
                />
              </Field>

              <Field error={errors.organizationEmail}>
                <Input
                  type='email'
                  placeholder='Correo de contacto'
                  value={form.organizationEmail}
                  onChange={handleChange('organizationEmail')}
                  invalid={!!errors.organizationEmail}
                />
              </Field>

              <Field error={errors.organizationPhone}>
                <Input
                  type='tel'
                  placeholder='Teléfono'
                  value={form.organizationPhone}
                  onChange={handleChange('organizationPhone')}
                  invalid={!!errors.organizationPhone}
                />
              </Field>

              <Field error={errors.organizationAddress}>
                <Input
                  type='text'
                  placeholder='Dirección'
                  value={form.organizationAddress}
                  onChange={handleChange('organizationAddress')}
                  invalid={!!errors.organizationAddress}
                />
              </Field>

              {/* De la lista del DANE: el departamento y la ciudad dentro de el. */}
              <Field error={errors.department}>
                <DepartmentSelect
                  aria-label='Departamento'
                  placeholder='Departamento'
                  value={form.department}
                  onChange={(department) => {
                    setForm((current) => ({ ...current, department, city: '' }));
                    setErrors((current) => ({ ...current, department: undefined }));
                  }}
                />
              </Field>

              <Field error={errors.city}>
                <CitySelect
                  aria-label='Ciudad'
                  placeholder='Ciudad'
                  department={form.department}
                  value={form.city}
                  onChange={(city) => {
                    setForm((current) => ({ ...current, city }));
                    setErrors((current) => ({ ...current, city: undefined }));
                  }}
                />
              </Field>
            </Row>

            {form.organizationType === 'BUYER' && (
              <>
                <p className='form-section-title'>Perfil del comprador</p>
                <Row>
                  <Field error={errors.legalNature}>
                    <Input
                      type='select'
                      aria-label='Naturaleza de la organización'
                      value={form.legalNature}
                      invalid={!!errors.legalNature}
                      onChange={(event) =>
                        cambiar({
                          legalNature: event.target.value as LegalNature | '',
                          buyerActivity: '',
                          ipsSector: '',
                          activityOther: '',
                        })
                      }
                    >
                      <option value=''>Naturaleza de la organización</option>
                      {LEGAL_NATURE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Input>
                  </Field>

                  <Field error={errors.buyerActivity}>
                    <Input
                      type='select'
                      aria-label='Actividad'
                      value={form.buyerActivity}
                      invalid={!!errors.buyerActivity}
                      disabled={!form.legalNature}
                      onChange={(event) =>
                        cambiar({
                          buyerActivity: event.target.value as BuyerActivity | '',
                          ipsSector: '',
                          activityOther: '',
                        })
                      }
                    >
                      <option value=''>
                        {form.legalNature ? 'Actividad' : 'Actividad (elige primero la naturaleza)'}
                      </option>
                      {form.legalNature &&
                        BUYER_ACTIVITY_OPTIONS[form.legalNature].map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </Input>
                  </Field>

                  {form.buyerActivity === 'IPS' && (
                    <Field error={errors.ipsSector} half={false}>
                      <Input
                        type='select'
                        aria-label='Sector de la IPS'
                        value={form.ipsSector}
                        invalid={!!errors.ipsSector}
                        onChange={(event) =>
                          cambiar({ ipsSector: event.target.value as IpsSector | '' })
                        }
                      >
                        <option value=''>Sector de la IPS</option>
                        {IPS_SECTOR_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Field>
                  )}

                  {form.buyerActivity === 'OTHER' && (
                    <Field error={errors.activityOther} half={false}>
                      <Input
                        type='text'
                        placeholder='¿A qué se dedica tu organización?'
                        value={form.activityOther}
                        invalid={!!errors.activityOther}
                        onChange={handleChange('activityOther')}
                      />
                    </Field>
                  )}

                  <Field error={errors.bankName}>
                    <Input
                      type='select'
                      aria-label='Banco con el que pagas'
                      value={form.bankName}
                      invalid={!!errors.bankName}
                      onChange={(event) => cambiar({ bankName: event.target.value })}
                    >
                      <option value=''>Banco con el que pagas</option>
                      {[...RECOMMENDED_BANKS, ...OTHER_BANKS].map((banco) => (
                        <option key={banco} value={banco}>
                          {banco}
                        </option>
                      ))}
                    </Input>
                  </Field>

                  <Field error={errors.bankAccountNumber}>
                    <Input
                      type='text'
                      inputMode='numeric'
                      placeholder='Número de cuenta'
                      value={form.bankAccountNumber}
                      invalid={!!errors.bankAccountNumber}
                      onChange={handleChange('bankAccountNumber')}
                    />
                  </Field>
                </Row>
                <p className='register-note'>
                  La cuenta debe estar a nombre de tu organización. Después te pediremos el
                  certificado bancario que la respalda.
                </p>
              </>
            )}

            <p className='form-section-title'>Tu cuenta de administrador</p>
            <Row>
              <Field error={errors.name}>
                <Input
                  type='text'
                  placeholder='Nombre completo'
                  value={form.name}
                  onChange={handleChange('name')}
                  invalid={!!errors.name}
                />
              </Field>

              <Field error={errors.email}>
                <Input
                  type='email'
                  placeholder='Correo electrónico'
                  value={form.email}
                  onChange={handleChange('email')}
                  invalid={!!errors.email}
                />
              </Field>

              <Field error={errors.password}>
                <Input
                  type={visible.password ? 'text' : 'password'}
                  placeholder='Contraseña'
                  value={form.password}
                  onChange={handleChange('password')}
                  invalid={!!errors.password}
                />
                <PasswordToggle visible={visible.password} onToggle={toggleVisible('password')} />
              </Field>

              <Field error={errors.confirmPassword}>
                <Input
                  type={visible.confirmPassword ? 'text' : 'password'}
                  placeholder='Confirmar contraseña'
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  invalid={!!errors.confirmPassword}
                />
                <PasswordToggle
                  visible={visible.confirmPassword}
                  onToggle={toggleVisible('confirmPassword')}
                />
              </Field>
            </Row>

            {generalError && <p className='text-danger mt-3 mb-0'>{generalError}</p>}

            <div className='button login'>
              <SubmitButton isLoading={isLoading} loadingLabel={authLabels.registering}>
                {authLabels.signUp}
              </SubmitButton>
            </div>
          </form>

          <p>
            <a
              className='theme-color'
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch(LOGINMODAL())}
            >
              {authLabels.alreadyHaveAccount}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;

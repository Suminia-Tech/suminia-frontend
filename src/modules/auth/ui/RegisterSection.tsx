'use client';

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Col, Input, Row } from 'reactstrap';

import { LOGINMODAL } from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { isEmail } from '@/shared/lib/validators';
import { PasswordToggle, SubmitButton } from '@/shared/ui';
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
  city: string;
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
  city: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

const validate = (form: RegisterForm): FormErrors => {
  const errors: FormErrors = {};

  if (!form.taxId.trim()) errors.taxId = 'Ingresa el NIT de la empresa';
  if (!form.legalName.trim()) errors.legalName = 'Ingresa la razón social';
  if (!form.organizationName.trim()) errors.organizationName = 'Ingresa el nombre comercial';

  if (!form.organizationEmail.trim()) errors.organizationEmail = 'Ingresa el correo de la empresa';
  else if (!isEmail(form.organizationEmail))
    errors.organizationEmail = 'El correo no tiene un formato válido';

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
        taxId: form.taxId.trim(),
        legalName: form.legalName.trim(),
        organizationName: form.organizationName.trim(),
        organizationEmail: form.organizationEmail.trim(),
        organizationPhone: form.organizationPhone.trim() || undefined,
        city: form.city.trim() || undefined,
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

              <Field error={errors.taxId}>
                <Input
                  type='text'
                  placeholder='NIT'
                  value={form.taxId}
                  onChange={handleChange('taxId')}
                  invalid={!!errors.taxId}
                />
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
                  type='text'
                  placeholder='Teléfono (opcional)'
                  value={form.organizationPhone}
                  onChange={handleChange('organizationPhone')}
                />
              </Field>

              <Field error={errors.city}>
                <Input
                  type='text'
                  placeholder='Ciudad (opcional)'
                  value={form.city}
                  onChange={handleChange('city')}
                />
              </Field>
            </Row>

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

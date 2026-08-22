'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Col, Row } from 'reactstrap';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { PasswordToggle } from '@/shared/ui';
import { STRONG_PASSWORD_HINT, isStrongPassword } from '@/shared/lib/validators';

import { useChangePasswordMutation } from '../api/authApi';

/* Cambio de contrasena de la propia cuenta.

   Se pide la actual porque el backend la exige: sin eso, una sesion abierta y
   desatendida bastaria para tomar la cuenta de forma permanente. */
const INITIAL = { currentPassword: '', newPassword: '', confirmPassword: '' };

export const SecurityScreen = () => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [visible, setVisible] = useState({ current: false, next: false });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange =
    (field: keyof typeof INITIAL) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setGeneralError(null);
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (!form.currentPassword) next.currentPassword = 'Ingresa tu contraseña actual';
    if (!form.newPassword) next.newPassword = 'Ingresa la contraseña nueva';
    else if (!isStrongPassword(form.newPassword)) next.newPassword = STRONG_PASSWORD_HINT;
    if (form.newPassword !== form.confirmPassword)
      next.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(next).length > 0) return setErrors(next);

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }).unwrap();
      setForm(INITIAL);
      toast.success('Contraseña actualizada');
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) {
        setGeneralError(extractErrorMessage(error, 'No se pudo cambiar la contraseña.'));
      }
    }
  };

  return (
    <>
      <div className='box-head'>
        <h3>Seguridad</h3>
      </div>

      {generalError && <div className='alert alert-danger'>{generalError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Contraseña actual</label>
            <div className='input'>
              <input
                type={visible.current ? 'text' : 'password'}
                className='form-control'
                value={form.currentPassword}
                onChange={handleChange('currentPassword')}
              />
              <PasswordToggle
                visible={visible.current}
                onToggle={() => setVisible((v) => ({ ...v, current: !v.current }))}
              />
            </div>
            {errors.currentPassword && (
              <small className='text-danger'>{errors.currentPassword}</small>
            )}
          </Col>
        </Row>

        <Row>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Contraseña nueva</label>
            <div className='input'>
              <input
                type={visible.next ? 'text' : 'password'}
                className='form-control'
                value={form.newPassword}
                onChange={handleChange('newPassword')}
              />
              <PasswordToggle
                visible={visible.next}
                onToggle={() => setVisible((v) => ({ ...v, next: !v.next }))}
              />
            </div>
            {errors.newPassword ? (
              <small className='text-danger'>{errors.newPassword}</small>
            ) : (
              <small className='font-light'>{STRONG_PASSWORD_HINT}</small>
            )}
          </Col>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Confirmar contraseña nueva</label>
            <input
              type={visible.next ? 'text' : 'password'}
              className='form-control'
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
            />
            {errors.confirmPassword && (
              <small className='text-danger'>{errors.confirmPassword}</small>
            )}
          </Col>
        </Row>

        <button type='submit' className='btn btn-primary btn-sm mt-2' disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </>
  );
};

export default SecurityScreen;

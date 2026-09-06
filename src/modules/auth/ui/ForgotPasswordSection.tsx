'use client';

import { useState, type FormEvent } from 'react';
import { Input } from 'reactstrap';

import { LOGINMODAL } from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { isEmail } from '@/shared/lib/validators';
import { SubmitButton } from '@/shared/ui';
import { useAppDispatch } from '@/store/hooks';

import { useForgotPasswordMutation } from '../api/authApi';
import { authLabels } from '../lib/labels';

const ForgotPasswordSection = () => {
  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) return setError('Ingresa tu correo electrónico');
    if (!isEmail(email.trim())) return setError('El correo no tiene un formato válido');

    try {
      await forgotPassword(email.trim()).unwrap();
      setSentTo(email.trim());
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo enviar el correo. Intenta de nuevo.'));
    }
  };

  if (sentTo) {
    return (
      <div className='login-section'>
        <div className='materialContainer'>
          <div className='box'>
            <div className='login-title'>
              <h2>Revisa tu correo</h2>
            </div>
            <p>
              Si <strong>{sentTo}</strong> corresponde a una cuenta, te enviamos un enlace para
              restablecer la contraseña.
            </p>
            <p className='text-muted'>El enlace caduca en 2 horas y solo se puede usar una vez.</p>
            <p>
              <a
                className='theme-color'
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch(LOGINMODAL())}
              >
                {authLabels.backToLogin}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='login-section'>
      <div className='materialContainer'>
        <div className='box'>
          <div className='login-title'>
            <h2>{authLabels.forgotPassword}</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className='input'>
              <Input
                type='email'
                name='email'
                id='emailname'
                placeholder='Ingresa tu correo electrónico'
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                invalid={!!error}
              />
              <span className='spin'></span>
              {error && <small className='text-danger d-block mt-1'>{error}</small>}
            </div>

            <div className='button login button-1'>
              <SubmitButton isLoading={isLoading} loadingLabel={authLabels.sending}>
                {authLabels.send}
              </SubmitButton>
            </div>
          </form>

          <p>
            <a
              className='theme-color'
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch(LOGINMODAL())}
            >
              {authLabels.backToLogin}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;

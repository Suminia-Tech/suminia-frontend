'use client';

import { ForgotPassword, Send } from '@/Constant';
import { LOGINMODAL } from '@/ReduxToolkit/Reducers/ModalReducer';
import { useForgotPasswordMutation } from '@/services/suminiaApi';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'reactstrap';
import { Btn } from '../../AbstractElements';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const ForgotPasswordSection = () => {
  const dispatch = useDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) return setError('Ingresa tu correo electrónico');
    if (!isEmail(email.trim())) return setError('El correo no tiene un formato válido');

    try {
      await forgotPassword(email.trim()).unwrap();
      setSentTo(email.trim());
    } catch (err) {
      const fields = err?.data?.errors || err?.data?.error;
      const first = fields && typeof fields === 'object' ? Object.values(fields)[0] : null;
      setError(
        (Array.isArray(first) ? first[0] : first) ||
          err?.data?.message ||
          'No se pudo enviar el correo. Intenta de nuevo.',
      );
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
              Si <strong>{sentTo}</strong> corresponde a una cuenta, te enviamos un enlace para restablecer la
              contraseña.
            </p>
            <p className='text-muted'>El enlace caduca en 2 horas y solo se puede usar una vez.</p>
            <p>
              <a className='theme-color' style={{ cursor: 'pointer' }} onClick={() => dispatch(LOGINMODAL())}>
                Volver a iniciar sesión
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
            <h2>{ForgotPassword}</h2>
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
              <Btn attrBtn={{ type: 'submit', disabled: isLoading }}>
                <span>{isLoading ? 'Enviando...' : Send}</span>
                <i className='fa fa-check'></i>
              </Btn>
            </div>
          </form>

          <p>
            <a className='theme-color' style={{ cursor: 'pointer' }} onClick={() => dispatch(LOGINMODAL())}>
              Volver a iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;

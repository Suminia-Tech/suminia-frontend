'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Input } from 'reactstrap';

import { OPENLOGINMODAL } from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppDispatch } from '@/store/hooks';

import { useResendVerificationMutation, useVerifyEmailMutation } from '../api/authApi';

/* Destino del enlace que envia el backend al registrarse:
   {FRONTEND_URL}/verify-email?token=<token>

   El token vive 2 horas y es de un solo uso, de modo que hay dos formas
   habituales de llegar aqui con un fallo: el enlace caduco, o ya se uso. En
   ambos casos se ofrece reenviar el correo, que es la unica salida para una
   cuenta que aun no puede iniciar sesion. */

type Status = 'verifying' | 'success' | 'error' | 'missing-token';

export const VerifyEmailScreen = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = searchParams.get('token');

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'missing-token');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [resendMessage, setResendMessage] = useState<{
    type: 'ok' | 'error';
    text: string;
  } | null>(null);

  // Evita una segunda llamada en el remontaje del modo estricto de React: el
  // token es de un solo uso y el segundo intento fallaria sobre uno ya valido.
  const attempted = useRef(false);

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;

    verifyEmail(token)
      .unwrap()
      .then(() => setStatus('success'))
      .catch((error: unknown) => {
        setErrorMessage(extractErrorMessage(error, 'No se pudo verificar el correo'));
        setStatus('error');
      });
  }, [token, verifyEmail]);

  const handleResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResendMessage(null);

    try {
      await resendVerification(email).unwrap();
      setResendMessage({
        type: 'ok',
        text: 'Te enviamos un correo nuevo. Revisa tu bandeja de entrada.',
      });
    } catch (error) {
      setResendMessage({
        type: 'error',
        text: extractErrorMessage(error, 'No se pudo reenviar el correo'),
      });
    }
  };

  return (
    <section className='log-in-section section-b-space'>
      <div className='container-fluid-lg w-100'>
        <div className='row justify-content-center'>
          <div className='col-xxl-5 col-xl-6 col-lg-8 col-md-10'>
            <div className='log-in-box text-center'>
              {status === 'verifying' && (
                <>
                  <h3>Verificando tu correo...</h3>
                  <p className='text-muted'>Esto toma solo un momento.</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <h3>Correo verificado</h3>
                  <p className='text-muted'>Tu cuenta ya está activa. Puedes iniciar sesión.</p>
                  <button
                    type='button'
                    className='btn btn-animation w-100 mt-3'
                    onClick={() => {
                      router.push('/');
                      dispatch(OPENLOGINMODAL());
                    }}
                  >
                    Iniciar sesión
                  </button>
                </>
              )}

              {(status === 'error' || status === 'missing-token') && (
                <>
                  <h3>No pudimos verificar tu correo</h3>
                  <p className='text-muted'>
                    {status === 'missing-token'
                      ? 'El enlace no incluye un token de verificación.'
                      : errorMessage}
                  </p>

                  <p className='text-muted mt-4'>
                    Los enlaces caducan a las 2 horas y solo se pueden usar una vez. Escribe tu
                    correo y te enviamos uno nuevo.
                  </p>

                  <form onSubmit={handleResend} className='mt-3'>
                    <Input
                      type='email'
                      placeholder='Tu correo electrónico'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                    <button
                      type='submit'
                      className='btn btn-animation w-100 mt-3'
                      disabled={isResending}
                    >
                      {isResending ? 'Enviando...' : 'Reenviar correo de verificación'}
                    </button>
                  </form>

                  {resendMessage && (
                    <p
                      className={`mt-3 ${resendMessage.type === 'ok' ? 'text-success' : 'text-danger'}`}
                    >
                      {resendMessage.text}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailScreen;

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Input, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { CLOSELOGINMODAL, LOGINMODAL } from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { PasswordToggle, SubmitButton } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { useLoginMutation } from '../api/authApi';
import { authLabels } from '../lib/labels';

const LoginModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loginModal } = useAppSelector((state) => state.ModalReducer);
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => dispatch(LOGINMODAL());

  const loginAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await login({ email, password }).unwrap();
      // Descarta los avisos de intentos fallidos previos: sin esto quedan
      // flotando sobre una sesion ya iniciada y parece que el login fallo.
      toast.dismiss();
      dispatch(CLOSELOGINMODAL());
      setPassword('');
      router.push('/page/user_dashboard');
    } catch (err) {
      /* El mensaje se muestra dentro del modal ademas de en el toast: el aviso
         flotante desaparece solo y es facil pasarlo por alto justo cuando hace
         falta leerlo. */
      const message = extractErrorMessage(err, 'No se pudo iniciar sesión');
      setError(message);
      // toastId fijo: reintentar no apila copias del mismo aviso.
      toast.error(message, { toastId: 'login-error' });
    }
  };

  return (
    <Modal className='login-modal' toggle={toggle} isOpen={loginModal} centered={true}>
      <div className='modal-content'>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <div className='login-section'>
            <div className='materialContainer'>
              <div className='box'>
                <div className='login-title'>
                  <h2>{authLabels.loginTitle}</h2>
                </div>
                <form onSubmit={loginAuth}>
                  <div className='input'>
                    <Input
                      type='email'
                      placeholder='Email'
                      name='email'
                      id='login-modal-email'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      required
                    />
                    <span className='spin'></span>
                  </div>
                  <div className='input'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      id='login-modal-password'
                      placeholder='Contraseña'
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      required
                    />
                    <PasswordToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                    />
                    <span className='spin'></span>
                  </div>
                  <Link
                    href={'/forgot-password'}
                    className='pass-forgot'
                    onClick={() => dispatch(CLOSELOGINMODAL())}
                  >
                    {authLabels.forgotYourPassword}
                  </Link>
                  {error && <p className='text-danger text-center mt-3 mb-0'>{error}</p>}

                  <div className='button login'>
                    <SubmitButton isLoading={isLoading} loadingLabel={authLabels.loggingIn}>
                      {authLabels.login}
                    </SubmitButton>
                  </div>
                </form>
                <p>
                  {authLabels.notAMember}
                  <Link
                    href={'/register'}
                    className='theme-color ps-1'
                    onClick={() => dispatch(CLOSELOGINMODAL())}
                  >
                    {authLabels.signUpNow}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default LoginModal;

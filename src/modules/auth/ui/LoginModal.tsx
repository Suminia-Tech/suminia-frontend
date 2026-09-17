'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from 'react';
import { toast } from 'react-toastify';
import { Input, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { CLOSELOGINMODAL, LOGINMODAL } from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { LoadingOverlay, PasswordToggle, SubmitButton } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { useLoginMutation } from '../api/authApi';
import { getHomePath } from '../lib/area';
import { SESSION_FEEDBACK_MS } from '../lib/session';
import { authLabels } from '../lib/labels';

const LoginModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loginModal } = useAppSelector((state) => state.ModalReducer);
  const [login, { isLoading }] = useLoginMutation();
  /* El velo no se levanta cuando responde el servidor sino cuando ya hay algo
     que mirar. Al proveedor y al administrador los lleva a su area, y esa
     navegacion tarda: `useTransition` avisa de cuando termina. El comprador se
     queda en la tienda, de modo que ahi no hay navegacion ninguna y sin el
     minimo el velo seria un destello. */
  const [entrando, setEntrando] = useState(false);
  const [navegando, startTransition] = useTransition();
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    [],
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => dispatch(LOGINMODAL());

  const loginAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const session = await login({ email, password }).unwrap();
      // Descarta los avisos de intentos fallidos previos: sin esto quedan
      // flotando sobre una sesion ya iniciada y parece que el login fallo.
      toast.dismiss();
      dispatch(CLOSELOGINMODAL());
      setPassword('');

      const destino = getHomePath(session.data.user);

      setEntrando(true);
      startTransition(() => router.push(destino));

      /* El saludo sale al retirarse el velo, no debajo de el: anunciarlo antes
         lo deja tapado durante toda la espera.

         Se confirma siempre, y no solo cuando hay a donde ir. El comprador se
         queda en la tienda, de modo que si entra desde la propia portada la
         pagina no cambia: sin esto, la unica señal de que la sesion empezo es
         el nombre en la esquina, que hay que ir a buscar. */
      temporizador.current = setTimeout(() => {
        setEntrando(false);
        toast.success(
          `${authLabels.welcomeBack}, ${session.data.user.name.split(' ')[0]}`,
          { toastId: 'login-ok' },
        );
      }, SESSION_FEEDBACK_MS);
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
    <>
      {/* Sobre el modal mientras se comprueban las credenciales: es el mismo
          velo que se ve al abrir la tienda, de modo que la espera se reconoce. */}
      <LoadingOverlay isOpen={isLoading || entrando || navegando} />
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
    </>
  );
};

export default LoginModal;

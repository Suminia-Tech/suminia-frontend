'use client';

import { Forgotyourpassword, LogIn, Logins, Notamember, Signupnow } from '@/Constant';
import { CLOSELOGINMODAL, LOGINMODAL } from '@/ReduxToolkit/Reducers/ModalReducer';
import { useLoginMutation } from '@/services/suminiaApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import PasswordToggle from '../../Element/PasswordToggle';

const LoginModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loginModal } = useSelector((state) => state.ModalReducer);
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggle = () => dispatch(LOGINMODAL());

  const loginAuth = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      dispatch(CLOSELOGINMODAL());
      setPassword('');
      router.push('/page/user_dashboard');
    } catch (error) {
      toast.error(error?.data?.message || 'No se pudo iniciar sesión');
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
                  <h2>{Logins}</h2>
                </div>
                <form onSubmit={loginAuth}>
                  <div className='input'>
                    <Input
                      type='email'
                      placeholder='Email'
                      name='email'
                      id='login-modal-email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                    <span className='spin'></span>
                  </div>
                  <Link href={'/page/forgot_password'} className='pass-forgot' onClick={() => dispatch(CLOSELOGINMODAL())}>
                    {Forgotyourpassword}
                  </Link>
                  <div className='button login'>
                    <Btn attrBtn={{ type: 'submit', disabled: isLoading }}>
                      <span>{isLoading ? 'Ingresando...' : LogIn}</span>
                      <i className='fa fa-check'></i>
                    </Btn>
                  </div>
                </form>
                <p>
                  {Notamember}
                  <Link href={'/page/register'} className='theme-color ps-1' onClick={() => dispatch(CLOSELOGINMODAL())}>
                    {Signupnow}
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

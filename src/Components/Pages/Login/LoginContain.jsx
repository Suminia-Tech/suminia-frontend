import { Forgotyourpassword, LogIn, Logins, Pleasefillthename } from '@/Constant';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Input } from 'reactstrap';
import { useLoginMutation } from '@/services/suminiaApi';
import { Btn } from '../../AbstractElements';
import AddAccountLink from './AddAccountLink';

const LoginContain = () => {
  const [email, setEmail] = useState('superuser@example.com');
  const [password, setPassword] = useState('S3crEtP4ssw0rd!');
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const loginAuth = async (email, password) => {
    try {
      await login({ email, password }).unwrap();
      setTimeout(() => {
        router.push(`/dashboard`);
      }, 200);
    } catch (error) {
      setTimeout(() => {
        toast.error(error?.data?.message || 'Login failed');
      }, 200);
    }
  };
  return (
    <div className='login-section'>
      <div className='materialContainer'>
        <div className='box'>
          <div className='login-title'>
            <h2>{Logins}</h2>
          </div>
          <div className='input'>
            <Input type='text' placeholder='Email' name='name' id='name' value={email} onChange={(e) => setEmail(e.target.value)} />
            <span className='spin'></span>
            <div className='valid-feedback'>{Pleasefillthename}</div>
          </div>
          <div className='input'>
            <Input type='password' name='password' id='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className='spin'></span>
          </div>
          <Link href={`/page/forgot_password`} className='pass-forgot'>
            {Forgotyourpassword}
          </Link>
          <div className='button login'>
            <Btn attrBtn={{ onClick: () => loginAuth(email, password), disabled: isLoading }}>
              <span>{isLoading ? 'Logging in...' : LogIn}</span>
              <i className='fa fa-check'></i>
            </Btn>
          </div>
          <AddAccountLink />
        </div>
      </div>
    </div>
  );
};

export default LoginContain;

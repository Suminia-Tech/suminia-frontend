import { Alreadyhaveanaccount, Registers, SignUp } from '@/Constant';
import Link from 'next/link';
import { Input } from 'reactstrap';

import { Btn } from '../../AbstractElements';

const RegisterSection = () => {
  return (
    <div className='login-section'>
      <div className='materialContainer'>
        <div className='box'>
          <div className='login-title'>
            <h2>{Registers}</h2>
          </div>

          <div className='input'>
            <Input placeholder='Nombre' type='text' name='name' id='name' />
            <span className='spin'></span>
          </div>

          <div className='input'>
            <Input type='text' name='name' id='emailname' placeholder='Correo electrónico' />
            <span className='spin'></span>
          </div>

          <div className='input'>
            <Input type='password' name='pass' id='pass' placeholder='Contraseña' />
            <span className='spin'></span>
          </div>

          <div className='input'>
            <Input type='password' name='pass' id='compass' placeholder='Confirmar contraseña' />
            <span className='spin'></span>
          </div>

          <div className='button login'>
            <Btn>
              <span>{SignUp}</span>
              <i className='fa fa-check'></i>
            </Btn>
          </div>

          <p>
            <Link href={'/page/login'} className='theme-color'>
              {Alreadyhaveanaccount}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;

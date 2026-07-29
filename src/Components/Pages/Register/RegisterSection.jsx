'use client';

import { Alreadyhaveanaccount, Registers, SignUp } from '@/Constant';
import { LOGINMODAL } from '@/ReduxToolkit/Reducers/ModalReducer';
import { useDispatch } from 'react-redux';
import { Input } from 'reactstrap';

import { Btn } from '../../AbstractElements';

const RegisterSection = () => {
  const dispatch = useDispatch();

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
            <a className='theme-color' style={{ cursor: 'pointer' }} onClick={() => dispatch(LOGINMODAL())}>
              {Alreadyhaveanaccount}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;

import { ForgotPassword, Send } from '@/Constant';
import { Input } from 'reactstrap';
import { Btn } from '../../AbstractElements';

const ForgotPasswordSection = () => {
  return (
    <div className='login-section'>
      <div className='materialContainer'>
        <div className='box'>
          <div className='login-title'>
            <h2>{ForgotPassword}</h2>
          </div>
          <div className='input'>
            <Input type='text' name='name' placeholder='Enter Email Address' className='is-invalid' id='emailname' />
            <span className='spin'></span>
          </div>
          <div className='button login button-1'>
            <Btn>
              <span>{Send}</span>
              <i className='fa fa-check'></i>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;

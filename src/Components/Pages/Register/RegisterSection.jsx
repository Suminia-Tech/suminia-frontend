import { Alreadyhaveanaccount, Facebook, Google, Orsignupwith, Registers, SignUp } from '@/Constant';
import Link from 'next/link';
import { Col, Input, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import Img from '@/Components/Element/Images';

const RegisterSection = () => {
  return (
    <div className='login-section'>
      <div className='materialContainer'>
        <div className='box'>
          <div className='login-title'>
            <h2>{Registers}</h2>
          </div>

          <div className='input'>
            <Input placeholder='Name' type='text' name='name' id='name' />
            <span className='spin'></span>
          </div>

          <div className='input'>
            <Input type='text' name='name' id='emailname' placeholder='EmailAddress' />
            <span className='spin'></span>
          </div>

          <div className='input'>
            <Input type='password' name='pass' id='pass' placeholder='Password' />
            <span className='spin'></span>
          </div>

          <div className='input'>
            <Input type='password' name='pass' id='compass' placeholder='ConfirmPassword' />
            <span className='spin'></span>
          </div>

          <div className='button login'>
            <Btn>
              <span>{SignUp}</span>
              <i className='fa fa-check'></i>
            </Btn>
          </div>

          <p className='sign-category'>
            <span>{Orsignupwith}</span>
          </p>

          <Row className='gx-md-3 gy-3'>
            <Col md='6'>
              <a href='https://www.facebook.com/'>
                <div className='social-media fb-media'>
                  <Img src='/assets/images/inner-page/facebook.png' className='img-fluid' alt='facebook' />
                  <h6>{Facebook}</h6>
                </div>
              </a>
            </Col>
            <Col md='6'>
              <a href='https://www.gmail.com/'>
                <div className='social-media google-media'>
                  <Img src='/assets/images/inner-page/google.png' className='img-fluid' alt='google' />
                  <h6>{Google}</h6>
                </div>
              </a>
            </Col>
          </Row>
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

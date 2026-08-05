import { Col } from 'reactstrap';
import { Address, Email, phone, VoxoMail, mobileno, ActualAddress, CommonPath } from '@/_template/Constant';
import Image from 'next/image';

const ContactFooter = () => {
  return (
    <>
      <Col xl='3' lg='4' md='6'>
        <div className='footer-contact'>
          <div className='brand-logo' style={{ marginBottom: '16px' }}>
            <a href='/'>
              <img src='/assets/svg/icons.svg' width={30} height={30} alt='logo-icon' className='svg-icon' style={{ marginRight: '8px' }} />
              <Image width={110} height={46} src={`${CommonPath}/logo.png`} className='img-fluid' alt='logo' style={{ marginTop: '2px' }} />
            </a>
          </div>
          <ul className='contact-lists'>
            <li>
              <span>
                <b>{phone}:</b>
                <span className='font-light'>{mobileno}</span>
              </span>
            </li>
            <li>
              <span>
                <b>{Address}:</b>
                <span className='font-light'> {ActualAddress}</span>
              </span>
            </li>
            <li>
              <span>
                <b>{Email}:</b>
                <span className='font-light'> {VoxoMail}</span>
              </span>
            </li>
          </ul>
        </div>
      </Col>
    </>
  );
};
export default ContactFooter;

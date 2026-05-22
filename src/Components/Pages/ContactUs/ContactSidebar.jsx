import { ActualAddress, Address, EmailAddress, LetTouch, PhoneNumber, SuggestionDes, ThemeEmail, ThemeEmail2, num1, num2 } from '@/Constant';
import { Mail, MapPin, Phone } from 'react-feather';
import { Col } from 'reactstrap';

const ContactSidebar = () => {
  return (
    <Col lg='5'>
      <div className='contact-details'>
        <div>
          <h2>{LetTouch}</h2>
          <h5 className='font-light'>{SuggestionDes}</h5>
          <div className='contact-box'>
            <div className='contact-icon'>
              <MapPin />
            </div>
            <div className='contact-title'>
              <h4>{Address}</h4>
              <p>{ActualAddress}</p>
            </div>
          </div>

          <div className='contact-box'>
            <div className='contact-icon'>
              <Phone />
            </div>
            <div className='contact-title'>
              <h4>{PhoneNumber}</h4>
              <p>{num1}</p>
              <p>{num2}</p>
            </div>
          </div>

          <div className='contact-box'>
            <div className='contact-icon'>
              <Mail />
            </div>
            <div className='contact-title'>
              <h4>{EmailAddress} :</h4>
              <p>{ThemeEmail}</p>
              <p>{ThemeEmail2}</p>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ContactSidebar;

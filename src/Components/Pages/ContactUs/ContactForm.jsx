import { Comment, ConfirmEmail, Contactus, Email, EmailRequired, FirstName, LastName, Submit } from '@/Constant';
import { Col, Input, Label, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';

const ContactForm = () => {
  return (
    <Col lg='7'>
      <div className='materialContainer'>
        <div className='material-details'>
          <div className='title title1 title-effect mb-1 title-left'>
            <h2>{Contactus}</h2>
            <p className='ms-0 w-100'>{EmailRequired}</p>
          </div>
        </div>
        <Row className='g-4 mt-md-1 mt-2'>
          <Col md='6'>
            <Label htmlFor='first' className='form-label'>
              {FirstName}
            </Label>
            <Input type='text' className='form-control' id='first' placeholder='Enter Your First Name' required />
          </Col>
          <Col md='6'>
            <Label htmlFor='last' className='form-label'>
              {LastName}
            </Label>
            <Input type='text' className='form-control' id='last' placeholder='Enter Your Last Name' required />
          </Col>
          <Col md='6'>
            <Label htmlFor='email' className='form-label'>
              {Email}
            </Label>
            <Input type='email' className='form-control' id='email' placeholder='Enter Your Email Address' required />
          </Col>
          <Col md='6'>
            <Label htmlFor='email2' className='form-label'>
              {ConfirmEmail}
            </Label>
            <Input type='email' className='form-control' id='email2' placeholder='Enter Your Confirm Email Address' required />
          </Col>

          <Col xs='12'>
            <Label htmlFor='comment' className='form-label'>
              {Comment}
            </Label>
            <textarea className='form-control' id='comment' rows='5' required></textarea>
          </Col>

          <div className='col-auto'>
            <Btn attrBtn={{ className: 'btn btn-solid-default' }}>{Submit}</Btn>
          </div>
        </Row>
      </div>
    </Col>
  );
};

export default ContactForm;

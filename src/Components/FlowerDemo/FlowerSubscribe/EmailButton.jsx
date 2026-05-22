import { Submit } from '@/Constant';
import { Col, Input, InputGroup } from 'reactstrap';
import { Btn } from '../../AbstractElements';
const EmailButton = () => {
  return (
    <Col lg='4' md='6' className='mt-md-0 mt-3'>
      <div className='subsribe-input'>
        <InputGroup>
          <Input type='text' className='subscribe-input' placeholder='Your Email Address' />
          <Btn attrBtn={{ className: 'btn-solid-default' }}>{Submit}</Btn>
        </InputGroup>
      </div>
    </Col>
  );
};

export default EmailButton;

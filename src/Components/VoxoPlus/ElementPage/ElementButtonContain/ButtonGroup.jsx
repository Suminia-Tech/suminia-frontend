import { Activelink, Buttongroups, Links } from '@/Constant';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { Btn } from '../../../AbstractElements';

const ButtonGroup = () => {
  return (
    <Col lg='6'>
      <Card className='custome-card'>
        <CardHeader>
          <h3 className='font-weight-bold'>{Buttongroups}</h3>
        </CardHeader>
        <CardBody>
          <div className='btn-group'>
            <Btn attrBtn={{ className: 'btn-primary active-button active' }}>{Activelink}</Btn>
            <Btn attrBtn={{ className: 'btn-primary' }}>{Links}</Btn>
            <Btn attrBtn={{ className: 'btn-primary' }}>{Links}</Btn>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ButtonGroup;

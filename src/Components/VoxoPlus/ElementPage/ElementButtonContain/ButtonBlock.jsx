import { Blocklevelbutton, Buttonblock } from '@/Constant';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { Btn } from '../../../AbstractElements';

const ButtonBlock = () => {
  return (
    <Col lg='6'>
      <Card className='custome-card'>
        <CardHeader>
          <h3 className='font-weight-bold'>{Buttonblock}</h3>
        </CardHeader>
        <CardBody>
          <div className='btn-group-showcase d-grid'>
            <Btn attrBtn={{ className: 'btn-solid-default btn-lg mb-3 btn-block' }}>{Blocklevelbutton}</Btn>
            <Btn attrBtn={{ className: 'btn-lg btn-block ms-0' }}>{Blocklevelbutton}</Btn>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ButtonBlock;

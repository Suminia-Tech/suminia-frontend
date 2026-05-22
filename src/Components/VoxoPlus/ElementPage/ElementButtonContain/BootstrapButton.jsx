import { Bootstrapbutton } from '@/Constant';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { BootstapButtonData } from '../../../../Data/ButtonsData';
import { Btn } from '../../../AbstractElements';

const BootstrapButton = () => {
  return (
    <Col sm='12'>
      <Card className='custome-card'>
        <CardHeader>
          <h3 className='font-weight-bold'>{Bootstrapbutton}</h3>
        </CardHeader>
        <CardBody>
          <div className='btn-group-showcase'>
            {BootstapButtonData.map((elem) => {
              return (
                <Btn attrBtn={{ className: elem.class }} key={elem.id}>
                  {elem.title}
                </Btn>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default BootstrapButton;

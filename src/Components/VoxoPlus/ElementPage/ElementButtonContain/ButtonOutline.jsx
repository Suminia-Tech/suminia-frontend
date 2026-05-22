import { ButtonOutlines } from '@/Constant';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { ButtonOutlineData } from '../../../../Data/ButtonsData';
import { Btn } from '../../../AbstractElements';

const ButtonOutline = () => {
  return (
    <Col sm='12'>
      <Card className='custome-card'>
        <CardHeader>
          <h3 className='font-weight-bold'>{ButtonOutlines}</h3>
        </CardHeader>
        <CardBody>
          <div className='btn-group-showcase'>
            {ButtonOutlineData.map((elem) => {
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

export default ButtonOutline;

import { Fragment } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { ThemeButtondata } from '../../../../Data/ButtonsData';
import { Btn } from '../../../AbstractElements';

const ThemeBtn = () => {
  return (
    <Fragment>
      {ThemeButtondata.map((item, i) => {
        return (
          <Col lg='6' key={i}>
            <Card className='custome-card'>
              <CardHeader>
                <h3 className='font-weight-bold'>{item.heading}</h3>
              </CardHeader>
              <CardBody>
                <div className='btn-group-showcase'>
                  {item.btn.map((elem) => {
                    return (
                      <Fragment key={elem.id}>
                        {item.heading === 'Theme buttons' && <a className={elem.class}>{elem.title}</a>}
                        {item.heading === 'Rounded buttons' && <Btn attrBtn={{ className: elem.class }}>{elem.title}</Btn>}
                      </Fragment>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Fragment>
  );
};

export default ThemeBtn;

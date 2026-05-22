import { All, App, Card, Web } from '@/Constant';
import { Col, Row } from 'reactstrap';

const GridNav = ({ handleClick, val }) => {
  return (
    <Row className='gx-2'>
      <Col xs='12'>
        <div className='filters button filter-button-group'>
          <ul>
            <li className={`btn btn-submit ${val === 'all' || val === undefined ? 'active' : ''}`} onClick={() => handleClick('all')}>
              <h4>{All}</h4>
            </li>
            <li className={`btn btn-submit ${val === 'app' ? 'active' : ''}`} onClick={() => handleClick('app')}>
              <h4>{App}</h4>
            </li>
            <li className={`btn btn-submit ${val === 'card' ? 'active' : ''}`} onClick={() => handleClick('card')}>
              <h4>{Card}</h4>
            </li>
            <li className={`btn btn-submit ${val === 'web' ? 'active' : ''}`} onClick={() => handleClick('web')}>
              <h4>{Web}</h4>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default GridNav;

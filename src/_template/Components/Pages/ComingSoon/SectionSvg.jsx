import { Col } from 'reactstrap';
import { ComingSoonSvg } from '../../../Data/SVG';

const SectionSvg = () => {
  return (
    <Col xs='12'>
      <div className='store-container'>
        <div className='border-animation'>
          <ComingSoonSvg />
        </div>
      </div>
    </Col>
  );
};

export default SectionSvg;

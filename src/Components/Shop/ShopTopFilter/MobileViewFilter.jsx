import { Latestfilter } from '@/Constant';
import { AlignLeft } from 'react-feather';
import { Col } from 'reactstrap';

const MobileViewFilter = () => {
  return (
    <Col xs='12'>
      <div className='filter-show-button mb-3 d-none'>
        <a href='#javascript' className='mobile-filter border-top-0'>
          <AlignLeft className='img-fluid' />
          <h5>{Latestfilter}</h5>
        </a>
      </div>
    </Col>
  );
};

export default MobileViewFilter;

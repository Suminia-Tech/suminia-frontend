import { ArrowLeft } from 'react-feather';
import { Col } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import { Close } from '@/Constant';
import FilterOptions from '../ShopCanvasFilter/FilterOptions';
import ShopLeftSlider from './ShopLeftSlider';

const SidebarFilter = ({ productData }) => {
  return (
    <Col lg='3' md='4'>
      <div className='category-option'>
        <div className='button-close mb-3'>
          <Btn attrBtn={{ className: 'btn p-0' }}>
            <ArrowLeft />
            {Close}
          </Btn>
        </div>
        <FilterOptions productData={productData} />
        <ShopLeftSlider />
      </div>
    </Col>
  );
};

export default SidebarFilter;

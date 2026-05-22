import { useState } from 'react';
import { Col } from 'reactstrap';
import { Back, Filter } from '@/Constant';
import AllBrands from './CategoriesDropdowns/AllBrands';
import AllCategories from './CategoriesDropdowns/AllCategories';
import AllColorFilter from './CategoriesDropdowns/AllColorFilter';
import FilterDiscount from './CategoriesDropdowns/FilterDiscount';

const TopfilterCategories = ({ productData }) => {
  const [isNum, setIsNum] = useState(0);
  return (
    <Col xs='12' className='m-0'>
      <div className='top-filter-section'>
        <ul>
          <li className='back-btn'>
            <div className='mobile_back text-end'>
              <span>{Back}</span>
              <i className='fa fa-angle-right ps-2'></i>
            </div>
          </li>

          <li className='filter-title'>
            <h6 className='theme-color'>{Filter} :</h6>
          </li>

          <AllCategories productData={productData} setIsNum={setIsNum} isNum={isNum} />
          <AllBrands productData={productData} setIsNum={setIsNum} isNum={isNum} />
          <AllColorFilter productData={productData} setIsNum={setIsNum} isNum={isNum} />
          <FilterDiscount productData={productData} setIsNum={setIsNum} isNum={isNum} />
        </ul>
      </div>
    </Col>
  );
};

export default TopfilterCategories;

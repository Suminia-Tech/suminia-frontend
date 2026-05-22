import { Col, Row } from 'reactstrap';
import CategoryCard from './CategoryCard';
import OurCategoryTop from '@/Components/Element/OurCategory';

const RowCategory = ({ categoryBanner }) => {
  return (
    <Row className='gy-3'>
      <OurCategoryTop />
      <Col lg='9' className='col-xxl-10'>
        <div className='category-wrapper category-slider1 white-arrow category-arrow'>
          <CategoryCard categoryBanner={categoryBanner} />
        </div>
      </Col>
    </Row>
  );
};

export default RowCategory;

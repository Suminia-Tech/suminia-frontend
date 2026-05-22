import { getAPIData } from '@/Utils';
import { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import AutoFadeSlider from '../Common/AutoFadeSlider';
import ProductDetails from '../ProductBundle/ProductDetails';
import ProductFilterButton from './ProductFilterButton';

const RightsideContain = ({id}) => {
  const [singleProduct, setSingleProduct] = useState([]);
  useEffect(() => {
    const types = ['product'];
    types.map((type) => {
      getAPIData(`/api/${type}/${ id ? id : "1"}`).then((res) => {
       
        type === 'product' && setSingleProduct(res?.data);
      });
    });
  }, [id]);
  return (
    <Col lg='9' xs='12'>
      <ProductFilterButton />
      <div className='details-items'>
        <Row className='g-4'>
          <Col md='6'>
            <AutoFadeSlider singleProduct={singleProduct} id={id} />
          </Col>
          <Col md='6'>
            <ProductDetails singleProduct={singleProduct} id={id} />
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default RightsideContain;

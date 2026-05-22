import Img from '@/Components/Element/Images';
import { ProductDescription1, ProductDescription2, ProductDescription3, ProductDescription4, ProductQuestion1, fabric } from '@/Constant';
import { Col, Row } from 'reactstrap';

const DescriptionDetails = () => {
  return (
    <div className='shipping-chart'>
      <div className='part'>
        <h4 className='inner-title mb-2'>{ProductQuestion1}</h4>
        <p className='font-light'>{ProductDescription1}</p>
      </div>

      <Row className='g-3 align-items-center'>
        <Col lg='8'>
          <p className='font-light'>{ProductDescription2}</p>

          <div className='part mt-3'>
            <h5 className='inner-title mb-2'>{fabric}:</h5>
            <p className='font-light'>{ProductDescription3}</p>
            <p className='font-light'>{ProductDescription4}</p>
          </div>
        </Col>

        <Col lg='4'>
          <Img src='/assets/images/fashion/slider/1.jpg' className='img-fluid rounded' alt='slider' />
        </Col>

        <Col lg='8' className='order-lg-2 mt-4'>
          <p className='font-light'>{ProductDescription2}</p>
          <div className='part mt-3'>
            <p className='font-light'>{ProductDescription2}</p>
          </div>
        </Col>

        <Col lg='4' className='order-lg-0 mt-4'>
          <Img src='/assets/images/fashion/slider/2.jpg' className='img-fluid rounded' alt='fashion' />
        </Col>
      </Row>
    </div>
  );
};

export default DescriptionDetails;

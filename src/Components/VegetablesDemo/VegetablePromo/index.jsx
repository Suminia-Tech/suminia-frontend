import { useRouter } from 'next/navigation';
import { Col, Container, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import { CommonPath, OPENPRODUCTPAGE, PromoData, promoCode } from '@/Constant';
import Img from '@/Components/Element/Images';
const VegetablePromo = () => {
  const router = useRouter();
  return (
    <section className='code-section pt-0'>
      <div className='overlay-color'>
        <Container>
          <Row className='px-0'>
            <Col lg='8' md='8'>
              <div className='code-contain'>
                <div className='code-image'>
                  <Img src={`${CommonPath}/vegetable/percent.png`} className='img-fluid' alt='code' />
                  <i className='fas fa-percentage'></i>
                </div>
                <h6>
                  {PromoData}
                  <span>{promoCode}</span>
                </h6>
              </div>
            </Col>

            <Col lg='4' md='4' className='d-flex'>
              <div className='text-md-end text-center mt-md-0 mt-3 w-100'>
                <Btn attrBtn={{ className: 'btn-size default-white', onClick: () => router.push('/product/product_left_sidebar/1') }}>{OPENPRODUCTPAGE}</Btn>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};
export default VegetablePromo;

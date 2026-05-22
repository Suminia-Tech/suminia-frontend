import { Col, Container, Row } from 'reactstrap';
import { JustForYou, Newoffers } from '@/Constant';
import LeftSideImage from './LeftSideImage';
import RightSideImage from './RightSideImage';
import SectionHeader from '@/Layout/Element/SectionHeader';
const FlowerNewOffer = ({ bannerData }) => {
  return (
    <section className='banner-style-2 offer-banner'>
      <Container>
        <Row>
          <Col>
            <SectionHeader title={Newoffers} subTitle={JustForYou} />
          </Col>
        </Row>
        <Row className='gy-4'>
          <LeftSideImage bannerData={bannerData} />
          <RightSideImage bannerData={bannerData} />
        </Row>
      </Container>
    </section>
  );
};
export default FlowerNewOffer;

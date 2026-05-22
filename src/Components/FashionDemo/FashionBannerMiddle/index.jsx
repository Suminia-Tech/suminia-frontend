import { Col, Container, Row } from 'reactstrap';
import { JustForYou, Newoffers } from '@/Constant';
import SectionHeader from '@/Layout/Element/SectionHeader';
import RightLeftCard from './RightLeftCard';

const FashionBannerMiddle = ({ bannerData, nohead, elemclass }) => {
  const MiddleBanner = bannerData?.filter((el) => el.subtype === 'fashionnewoffer');
  return (
    <section className={`banner-style-2 offer-banner ${elemclass}`}>
      <Container>
        {nohead !== false && (
          <Row>
            <Col>
              <SectionHeader title={Newoffers} subTitle={JustForYou} />
            </Col>
          </Row>
        )}
        <RightLeftCard MiddleBanner={MiddleBanner} />
      </Container>
    </section>
  );
};
export default FashionBannerMiddle;

import { Container, Row } from 'reactstrap';
import TopBannerCard from './TopBannerCard';
const FlowerBannerTop = ({ bannerData, elemclass }) => {
  return (
    <section className={`ratio2_1 banner-style-2 ${elemclass}`}>
      <Container>
        <Row className='gy-4'>
          <TopBannerCard bannerData={bannerData} />
        </Row>
      </Container>
    </section>
  );
};
export default FlowerBannerTop;

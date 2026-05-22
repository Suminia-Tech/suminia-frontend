import { Container, Row } from 'reactstrap';
import BannerCard from './BannerCard';

const VegetableTopBanner = ({ bannerData }) => {
  const VegeTopFilter = bannerData.filter((el) => el.subtype === 'vegetablestopbanner');
  return (
    <section className='ratio_landscape banner-style-2'>
      <Container>
        <Row className='gy-3'>
          <BannerCard VegeTopFilter={VegeTopFilter} />
        </Row>
      </Container>
    </section>
  );
};

export default VegetableTopBanner;

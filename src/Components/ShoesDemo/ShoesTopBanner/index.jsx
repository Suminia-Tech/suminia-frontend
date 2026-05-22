import { Container } from 'reactstrap';
import BannerCard from './BannerCard';
const ShoesTopBanner = ({ bannerData, elemclass }) => {
  const BannerFilter = bannerData?.filter((el) => el.subtype === 'shoestopbanner');
  return (
    <section className={`poster-section ratio2_1 ${elemclass}`}>
      <div>
        <Container>
          <BannerCard BannerFilter={BannerFilter} />
        </Container>
      </div>
    </section>
  );
};
export default ShoesTopBanner;

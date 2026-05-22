import { Container } from 'reactstrap';
import HomeSlider from './HomeSlider';

const FashionBannerTop = ({ mainSlider }) => {
  return (
    <>
      <section className='home-section home-section-2 pt-0'>
        <Container fluid={true} className='p-0'>
          <div className='slick-2 dot-dark'>
            <HomeSlider mainSlider={mainSlider} />
          </div>
        </Container>
      </section>
    </>
  );
};
export default FashionBannerTop;

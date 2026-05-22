import { Container } from 'reactstrap';
import MainSliderCard from './MainSliderCard';

const ElectronicHomeSlider = ({ mainSlider }) => {
  const ElectronicSliderFilter = mainSlider?.filter((el) => el.type === 'electronic');
  return (
    <section className='home-section home-section-1'>
      <Container fluid={true}>
        <div className='slick-1 classic-arrow'>
          <MainSliderCard ElectronicSliderFilter={ElectronicSliderFilter} />
        </div>
      </Container>
    </section>
  );
};
export default ElectronicHomeSlider;

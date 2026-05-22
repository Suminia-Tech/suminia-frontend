import { Mostpopularss, OurCollection } from '@/Constant';
import { FlowerProductSlider } from '@/Data/SliderSettingsData';
import Slider from 'react-slick';
import { Col } from 'reactstrap';
import SectionHeader from '../../Element/SectionHeader';
import MostPopularCard from './MostPopularCard';
const MostPopular = ({ productData }) => {
  return (
    <Col lg='4'>
      <SectionHeader title={Mostpopularss} subTitle={OurCollection} customeclass={true} />
      <div className='product-slider round-arrow1'>
        <Slider {...FlowerProductSlider}>
          <MostPopularCard productData={productData} />
          <MostPopularCard productData={productData} />
        </Slider>
      </div>
    </Col>
  );
};
export default MostPopular;

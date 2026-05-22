import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import { ShoesCategorySlider } from '../../../Data/SliderSettingsData';

const CategoryCard = ({ ShoesFilter }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <div className='category-wrapper category-slider white-arrow'>
      <Slider {...ShoesCategorySlider}>
        {ShoesFilter.map((el) => {
          return el.children.map((elem, i) => {
            return (
              <div key={i}>
                <div className='category-wrap category-color'>
                  <Link href={'/shop/shop_left_sidebar'}>
                    <Img src={`${CommonPath}/${elem.image}`} className='img-fluid' alt='category image' />
                    <div className='category-content category-text t-text'>
                      <h3>{elem.title}</h3>
                      <span>
                        {symbol}
                        {elem.startingPrice * currencyValue} - {symbol}
                        {elem.endiginPrice * currencyValue}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            );
          });
        })}
      </Slider>
    </div>
  );
};

export default CategoryCard;

import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';
import { CategoryBannerSlider } from '@/Data/SliderSettingsData';
import Link from 'next/link';
import Slider from 'react-slick';

const CategoryCard = ({ categorybanner }) => {
  const CategoryFilter = categorybanner.filter((el) => el.type === 'flower');
  return (
    <div className='category-wrapper category-slider1 white-arrow product-wrapper'>
      <Slider {...CategoryBannerSlider}>
        {CategoryFilter.map((el) => {
          return el.categories.map((elem, i) => {
            return (
              <div key={i}>
                <Link href={`/shop/shop_left_sidebar`} className='category-wrap bg-size'>
                  <Img src={`${CommonPath}/${elem.image}`} alt='wrap' className='bg-img' />
                  <div className='category-content category-spacing'>
                    <h3 className='theme-color'>{elem.title}</h3>
                    <span>{elem.subtitle}</span>
                  </div>
                </Link>
              </div>
            );
          });
        })}
      </Slider>
    </div>
  );
};

export default CategoryCard;

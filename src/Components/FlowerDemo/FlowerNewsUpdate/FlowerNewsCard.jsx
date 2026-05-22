import { useRouter } from 'next/navigation';
import Slider from 'react-slick';
import { FlowerUpdateSlider } from '../../../Data/SliderSettingsData';
import { Btn } from '../../AbstractElements';
import { CommonPath } from '@/Constant';
import Img from '../../Element/Images';

const FlowerNewsCard = ({ bannerData }) => {
  const router = useRouter();
  const FlowerNewsFilter = bannerData.filter((el) => el.subtype === 'flowernewsandupdate');
  return (
    <div className='slide-3'>
      <Slider {...FlowerUpdateSlider}>
        {FlowerNewsFilter.map((el) => {
          return el.children.map((elem, i) => {
            return (
              <div className='product-style-4 ratio2_3' key={i}>
                <div className='blog-header'>
                  <div className='blog-image bg-size'>
                    <Img src={`${CommonPath}/${elem.image}`} alt='blog-header' className='bg-img' />
                    <div className='blog-date'>
                      <div className='date-hover'>
                        <div>
                          <h2>{elem.date}</h2>
                          <h3>{elem.month}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='blog-footer'>
                  <h2 className='theme-color'>{elem.title}</h2>
                  <h5 className='theme-color'>{elem.discount}</h5>
                  <h4>{elem.fresh}</h4>
                  <h4 className='brand-name'>{elem.pricetitle}</h4>
                  <Btn
                    attrBtn={{
                      className: 'default-theme',
                      onClick: () => router.push('/blog/blog_details'),
                    }}>
                    {elem.btn}
                    <i className='fas fa-chevron-right ms-2'></i>
                  </Btn>
                </div>
              </div>
            );
          });
        })}
      </Slider>
    </div>
  );
};
export default FlowerNewsCard;

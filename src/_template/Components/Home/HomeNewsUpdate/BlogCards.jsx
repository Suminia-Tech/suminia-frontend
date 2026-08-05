import { CommonPath, ReadMore } from '@/_template/Constant';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import Slider from 'react-slick';
import { BottomBanner } from '../../../Data/SliderSettingsData';
import { Btn } from '../../AbstractElements';
import Img from '../../Element/Images';

const BlogCards = ({ BottomBannerFilter }) => {
  const router = useRouter();
  return (
    <Fragment>
      <div className='product-wrapper slide-3'>
        <Slider {...BottomBanner}>
          {BottomBannerFilter.map((el) => {
            return el.banners.map((elem, i) => {
              return (
                <div className='product-style-4 ratio2_3' key={i}>
                  <div className='blog-header'>
                    <div className='blog-image bg-size'>
                      <Img src={`${CommonPath}/${elem.image}`} alt='shop' className='bg-img' />
                      <div className='blog-date gradient-color'>
                        <div className='date-hover'>
                          <div>
                            <h2>{elem.day}</h2>
                            <h3>{elem.month}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='blog-footer'>
                    <h2 className='theme-color'>{elem.watermark}</h2>
                    <h5 className='theme-color'>{elem.title}</h5>
                    <h6>{elem.headingtop}</h6>
                    <p className='brand-name' style={{ fontSize: '13px', lineHeight: '1.4' }}>{elem.headingbottom}</p>
                    <Btn
                      attrBtn={{
                        className: 'default-theme',
                        onClick: () => router.push(`/blog/blog_details?id=${i}`),
                      }}>
                      {ReadMore}
                      <i className='fas fa-chevron-right'></i>
                    </Btn>
                  </div>
                </div>
              );
            });
          })}
        </Slider>
      </div>
    </Fragment>
  );
};

export default BlogCards;

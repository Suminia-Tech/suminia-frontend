import Img from '@/Components/Element/Images';
import { CommonPath, OFF } from '@/Constant';
import Link from 'next/link';
import { Col } from 'reactstrap';

const TopBannerCard = ({ bannerData }) => {
  const BannerTop = bannerData.filter((el) => el.subtype === 'flowertopbanner');
  return (
    <>
      {BannerTop &&
        BannerTop.map((el) => {
          return el.children.map((elem, i) => {
            return (
              <Col lg='4' className={`${elem.class ? '' : 'col-md-6'}`} key={i}>
                <div className='collection-banner p-bottom p-center text-center'>
                  <Link href={`/shop/shop_left_sidebar`} className='banner-img bg-size'>
                    <Img src={`${CommonPath}/${elem.image}`} className='bg-img' alt='shop' />
                  </Link>
                  <div className='banner-detail'>
                    <a href='#javascript' className='heart-wishlist'>
                      <i className='far fa-heart'></i>
                    </a>
                    <span className='font-dark-30'>
                      {elem.discount}% <span>{OFF}</span>
                    </span>
                  </div>
                  <Link href={`/shop/shop_left_sidebar`} className='contain-banner contain-center'>
                    <div className='banner-content banner-center with-bg'>
                      <h2 className='mb-2'>{elem.heading}</h2>
                      <span>{elem.subheading}</span>
                    </div>
                  </Link>
                </div>
              </Col>
            );
          });
        })}
    </>
  );
};

export default TopBannerCard;

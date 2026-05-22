import Link from 'next/link';
import { Heart } from 'react-feather';
import { useSelector } from 'react-redux';
import { Col } from 'reactstrap';
import { CommonPath } from '@/Constant';
import Img from '@/Components/Element/Images';

const TopBannerCard = ({ bannerData }) => {
  const BannerFilter = bannerData.filter((el) => el.subtype === 'furnituretopbanner');
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <>
      {BannerFilter.map((el) => {
        return el.children.map((elem, i) => {
          return (
            <Col lg='4' className={`${elem.class ? '' : 'col-md-6'}`} key={i}>
              <div className='banner-image'>
                <a>
                  <Img src={`${CommonPath}/${elem.image}`} className='w-100' alt='table' />
                </a>
                <div className='banner-details'>
                  <a href='#javascript' className='heart-button'>
                    <Heart />
                  </a>
                  <h4>
                    {elem.discount}% <span className='theme-color'>{elem.off}</span>
                  </h4>
                  <div className='banner-price'>
                    <h2>
                      {symbol}
                      {(elem.price * currencyValue).toFixed(2)}
                    </h2>
                    <h5 className='theme-color'>
                      <del>
                        {symbol}
                        {(elem.delprice * currencyValue).toFixed(2)}
                      </del>
                    </h5>
                  </div>
                </div>
                <Link href={`/shop/shop_left_sidebar`} className='banner-shop text-center'>
                  <div>
                    <h5>{elem.heading}</h5>
                    <p className='mb-0 mt-2'>{elem.subHeading}</p>
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

import { useRouter } from 'next/navigation';
import { Col } from 'reactstrap';
import { CommonPath, ShopNow } from '@/Constant';
import Img from '@/Components/Element/Images';
import { Btn } from '@/Components/AbstractElements';

const LeftSideImage = ({ bannerData }) => {
  const router = useRouter();
  const LeftSidebar = bannerData.filter((el) => el.subtype === 'flowernewoffer');
  return (
    <Col lg='6' className='ratio2_1'>
      {LeftSidebar.map((el, i) => {
        return (
          <div className='collection-banner p-right text-right' key={i}>
            <a className='banner-img bg-size'>
              <Img src={`${CommonPath}/${el.leftbanner.image}`} className='bg-img' alt='leftimage' />
            </a>
            <div className='banner-text'>
              <div className='banner-content'>
                <span className='span-top'>
                  {el.leftbanner.topheadingleft} <span className='theme-color'>{el.leftbanner.topheadingright} </span>
                </span>
                <h2>
                  {el.leftbanner.heading} <span className='theme-color'>{el.leftbanner.price} </span>
                </h2>
                <Btn
                  attrBtn={{
                    className: 'btn-solid-default',
                    onClick: () => router.push('/shop/shop_left_sidebar'),
                  }}>
                  {ShopNow}
                </Btn>
              </div>
            </div>
          </div>
        );
      })}
    </Col>
  );
};

export default LeftSideImage;

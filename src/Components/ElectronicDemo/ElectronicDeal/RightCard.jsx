import { CommonPath, ShopNow } from '@/Constant';
import { useRouter } from 'next/navigation';
import { Col } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import Img from '../../Element/Images';

const RightCard = ({ elem }) => {
  const router = useRouter();
  return (
    <Col xl='3' lg='4' className='small-banner'>
      <div className='collection-banner text-center collection-center bg-size'>
        <Img src={`${CommonPath}/${elem.rightimage}`} className='bg-img' alt='small-banner' />
        <div className='collection-contain'>
          <h6 className='theme-color mb-2'>{elem.rightsmallheading}</h6>
          <h2>{elem.rightheadingtop} </h2>
          <h2>{elem.rightheadingbottom}</h2>
          <p className='mt-2 mb-0 font-light'>{elem.bottomsmalltop} </p>
          <p className='font-light mb-0'> {elem.bottomsmallbottom}</p>
          <Btn attrBtn={{ className: 'btn btn-solid-default mt-lg-4 mt-2', onClick: () => router.push('/shop/shop_left_sidebar') }}>{ShopNow}</Btn>
        </div>
      </div>
    </Col>
  );
};

export default RightCard;

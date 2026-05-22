import { useRouter } from 'next/navigation';
import { Heart } from 'react-feather';
import { Btn } from '../../AbstractElements';
import { CommonPath, ShopNow } from '@/Constant';
import CountDown from '../../Element/CountDown';
import Img from '@/Components/Element/Images';

const DealContain = ({ bannerData }) => {
  const router = useRouter();
  const DealData = bannerData.filter((el) => el.subtype === 'flowerdeal');
  const themeColor = true;
  return (
    <>
      {DealData.map((elem, i) => {
        return (
          <div className='discount-image-details-2' key={i}>
            <div className='discount-images'>
              <Img src={`${CommonPath}/${elem.leftimage}`} className='img-fluid flower-images-1' alt='discount' />
              <Img src={`${CommonPath}/${elem.rightimage}`} className='img-fluid flower-images-2' alt='discount' />
            </div>

            <div className='discunt-details mt-lg-0 mt-4'>
              <div>
                <div className='heart-button heart-button-light'>
                  <Heart className='feather' />
                </div>

                <div className='discount-shop'>
                  <h2>{elem.lefthead}</h2>
                  <h6>{elem.leftsubhead}</h6>
                </div>

                <h5 className='mt-3'>
                  {elem.mainhead1}
                  <span className='theme-color'>{elem.offer}</span>
                </h5>
                <h2 className='mt-3 deal-text'>
                  {elem.mainhead2}
                  <br />
                  {elem.mainhead3} <span className='theme-color'>{elem.price}</span>
                </h2>
                <div className='timer-style-2 mt-xl-1 my-2 justify-content-center d-flex'>
                  <CountDown themeColor={themeColor} />
                </div>
                <Btn
                  attrBtn={{
                    className: 'default-light-theme default-theme mt-2',
                    onClick: () => router.push('/shop/shop_left_sidebar'),
                  }}>
                  {ShopNow}
                </Btn>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DealContain;

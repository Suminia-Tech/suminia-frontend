import { useRouter } from 'next/navigation';
import { CommonPath, ShopNow } from '@/Constant';
import Img from '@/Components/Element/Images';
import { Btn } from '@/Components/AbstractElements';
import CountDown from '@/Components/Element/CountDown';
const DealCard = ({ bannerData }) => {
  const router = useRouter();
  const DealBanner = bannerData?.filter((el) => el.subtype === 'fashiondeal');
  const themeColor = true;
  return (
    <>
      {DealBanner &&
        DealBanner?.map((item, i) => {
          return (
            <div className='discount-image-details discount-spacing bg-size fashion-discount' key={i}>
              <Img src={`${CommonPath}/${item.image}`} className='bg-img' alt='fashion' />
              <div className='discunt-details'>
                <div>
                  <div className='heart-button heart-button-2'>
                    <i className='fas fa-heart theme-color'></i>
                  </div>

                  <h5 className='mt-3'>
                    {item.topHeading}
                    <span className='theme-color'>{item.topHeadingColor}</span>
                  </h5>
                  <h2 className='my-3 deal-text'>
                    {item.mainHeading}
                    <br />
                    {item.mainHeadin2}
                    <span className='theme-color'>{item.mainHeading2Color}</span>
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

                  <div className='timer-bg timer-bg-center d-lg-block d-none'>
                    <h3 className='mt-0'>{item.leftHeading}</h3>
                    <span>{item.leftsubheading}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};
export default DealCard;

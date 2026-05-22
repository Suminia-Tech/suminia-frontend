import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Btn } from '../../AbstractElements';
import { ShopNow } from '@/Constant';

const VegeLeftContain = ({ VegetableSlider }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const router = useRouter();
  return (
    <>
      {VegetableSlider.map((elem, i) => {
        return (
          <Fragment key={i}>
            <div className='left-side-contain'>
              <div className='banner-left'>
                <h4>
                  {elem.lefttitle} <span className='theme-color'>{elem.discount}</span>
                </h4>
                <h1>
                  {elem.heading} <span>{elem.headingbottom}</span>
                </h1>
                <p>
                  {elem.bottomtitletop} <span className='theme-color'>{elem.bottomtitlebottom}</span>
                </p>
                <h2>
                  {symbol}
                  {(elem.price * currencyValue).toFixed(2)}
                  <span className='theme-color'>
                    <del>
                      {symbol}
                      {(elem.mrp * currencyValue).toFixed(2)}
                    </del>
                  </span>
                </h2>
                <p className='poster-details'>{elem.description}</p>
                <div className='banner-btn-grup'>
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
            <div className='right-side-contain'>
              {elem?.socials.map((item, i) => {
                return (
                  <div className='social-image' key={i}>
                    <a href={item.link} target='new'>
                      <h6>{item.name}</h6>
                    </a>
                  </div>
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

export default VegeLeftContain;

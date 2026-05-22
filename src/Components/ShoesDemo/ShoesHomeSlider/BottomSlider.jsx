import { useSelector } from 'react-redux';

const BottomSlider = ({ elem }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <>
      <div className='price-number'>
        <h2>
          {symbol}
          {(elem.bottomPrice * currencyValue).toFixed(2)}
          <span>
            <del>
              {symbol}
              {(elem.bottomMrp * currencyValue).toFixed(2)}
            </del>
          </span>
        </h2>
        <h6>{elem.bottomDescription}</h6>
      </div>

      <div className='slider-arrow-2'>
        <div className='left-arrow d-lg-block d-none'></div>
        <div className='right-arrow d-lg-block d-none'></div>
      </div>
    </>
  );
};

export default BottomSlider;

import { useSelector } from 'react-redux';
const LeftContain = ({ FlowerHomeSlider }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <div className='left-side-contain'>
      {FlowerHomeSlider.map((elem, i) => {
        return (
          <div className='banner-left mb-0' key={i}>
            <h4>
              {elem.lefttitle} <span className='theme-color'>{elem.discount}</span>
            </h4>
            <h1>
              {elem.heading}
              <span>{elem.headingbottom}</span>
            </h1>
            <p>
              {elem.bottomtitletop}
              <span className='theme-color'>{elem.bottomtitlebottom}</span>
            </p>
            <h2>
              {symbol}
              {(elem.price * currencyValue).toFixed(2)}
              <span className='theme-color'>
                &nbsp;
                <del>
                  {symbol} {(elem.delprice * currencyValue).toFixed(2)}
                </del>
              </span>
            </h2>
            <p className='poster-details'>{elem.description}</p>
          </div>
        );
      })}
    </div>
  );
};
export default LeftContain;

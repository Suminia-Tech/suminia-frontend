import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

const LeftContain = ({ PosterFilter }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <>
      {PosterFilter.map((elem, i) => {
        return (
          <Fragment key={i}>
            <div className='left-side-contain'>
              <div className='banner-left'>
                <h4>
                  {elem.lefttitle} <span className='theme-color'>{elem.discount}</span>
                </h4>
                <h1>
                  {elem.heading}
                  <span>{elem.headingbottom}</span>
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
                      {(elem.delprice * currencyValue).toFixed(2)}
                    </del>
                  </span>
                </h2>
                <p className='poster-details mb-0'>{elem.description}</p>
              </div>
            </div>
            <div className='right-side-contain'>
              {elem.socials.map((item, i) => {
                return (
                  <div className='social-image' key={i}>
                    <h6>{item.name}</h6>
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

export default LeftContain;

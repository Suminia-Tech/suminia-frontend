import React from 'react';
import { useState } from 'react';
import { BestSeller, Color, OFF } from '@/Constant';
import GifComponents from '../Product4ImageContain/GifComponents';
import ProductActions from '../Product4ImageContain/ProductActions';
import ProductProgressBar from '../Product4ImageContain/ProductProgressBar';
import ProductSizeChart from '../Product4ImageContain/ProductSizeChart';
import ShareSocial from '../Product4ImageContain/ShareSocial';
import BundleCartDetails from './BundleCartDetails';

const ProductDetails = ({ bundles, singleProduct }) => {
  const [active, setActive] = useState();
  return (
    <div className='cloth-details-size'>
      <GifComponents />

      <div className='details-image-concept'>
        <h2>{singleProduct && singleProduct[0]?.name}</h2>
      </div>

      <div className='label-section'>
        <span className='badge badge-grey-color'>{BestSeller}</span>
        <span className='label-text'>in {singleProduct && singleProduct[0]?.type}</span>
      </div>

      <h3 className='price-detail'>
        ${singleProduct && singleProduct[0]?.price} <del>${singleProduct && singleProduct[0]?.mrp}.00</del>
        {singleProduct && singleProduct[0]?.discount !== 0 && (
          <span>
            {singleProduct && singleProduct[0]?.discount}% {OFF}
          </span>
        )}
      </h3>

      <div className='color-selector'>
        <h5>{Color} :</h5>
        <ul className='image-section'>
          <li className=''>
            <a href='#javascript' onClick={() => setActive(1)} style={{ background: 'red' }}>
              {active === 1 && <i className='fas fa-check'></i>}
            </a>
          </li>
          <li>
            <a href='#javascript' onClick={() => setActive(2)} style={{ background: 'blue' }}>
              {active === 2 && <i className='fas fa-check'></i>}
            </a>
          </li>
          {singleProduct &&
            singleProduct?.colors?.map((elem, i) => (
              <li key={i}>
                <a style={{ background: elem }}>
                  <i className='fas fa-check'></i>
                </a>
              </li>
            ))}
        </ul>
      </div>
      <ProductSizeChart />
      <ProductActions singleProduct={singleProduct} />
      <ProductProgressBar />
      <ShareSocial />
      {bundles && <BundleCartDetails />}
    </div>
  );
};

export default ProductDetails;

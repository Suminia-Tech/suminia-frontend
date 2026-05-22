import React from 'react';
import { Media } from 'reactstrap';

const NoProductFound = () => {
  return (
    <div className='search-suggestion'>
      <ul className='custom-scroll'>
        <li>
          <Media className='product-cart'>{'No Data Found'}</Media>
        </li>
      </ul>
    </div>
  );
};

export default NoProductFound;

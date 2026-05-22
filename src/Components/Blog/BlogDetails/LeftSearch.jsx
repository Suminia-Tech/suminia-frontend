import React from 'react';
import { Input } from 'reactstrap';
import { Btn } from '../../AbstractElements';

const LeftSearch = () => {
  return (
    <div className='search-section'>
      <div className='input-group search-bar'>
        <Input type='search' className='search-input' placeholder='Search' />
        <Btn attrBtn={{ className: 'input-group-text search-button' }}>
          <i className='fas fa-search text-color'></i>
        </Btn>
      </div>
    </div>
  );
};

export default LeftSearch;

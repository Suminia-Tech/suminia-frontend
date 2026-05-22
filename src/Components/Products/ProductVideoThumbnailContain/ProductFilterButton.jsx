import React from 'react';
import { AlignLeft } from 'react-feather';
import { Btn } from '../../AbstractElements';
import { Filter } from '@/Constant';

const ProductFilterButton = () => {
  return (
    <div className='filter-button mb-3'>
      <Btn attrBtn={{ className: 'danger-button danger-center btn btn-sm filter-btn' }}>
        <AlignLeft /> {Filter}
      </Btn>
    </div>
  );
};

export default ProductFilterButton;

/* eslint-disable react/no-unescaped-entities */
import React, { Fragment } from 'react';
import { WishlistColumns, WishlistData } from '../../../Data/WishlistData';
import { MyWishlist } from '@/Constant';
import DataTables from '../../Element/DataTable';

const WishListContain = () => {
  return (
    <Fragment>
      <div className='box-head mb-3'>
        <h3>{MyWishlist}</h3>
      </div>
      <div className='table-responsive'>
        <DataTables data={WishlistData} columns={WishlistColumns} />
      </div>
    </Fragment>
  );
};

export default WishListContain;

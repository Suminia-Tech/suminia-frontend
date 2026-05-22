import React from 'react';
import { action, availability, image, price, ProductName } from '@/Constant';
const WishlistTableHead = () => {
  return (
    <thead>
      <tr className='table-head'>
        <th scope='col'>{image}</th>
        <th scope='col'>{ProductName}</th>
        <th scope='col'>{price}</th>
        <th scope='col'>{availability}</th>
        <th scope='col'>{action}</th>
      </tr>
    </thead>
  );
};
export default WishlistTableHead;

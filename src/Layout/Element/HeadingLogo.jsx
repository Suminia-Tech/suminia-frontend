import { CommonPath } from '@/Constant';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const HeadingLogo = () => {
  return (
    <div className='brand-logo'>
      <Link href={'/'}>
        <svg className='svg-icon'>
          <use className='fill-color' xlinkHref='/assets/svg/icons.svg#logo'></use>
        </svg>
        <Image width={58} height={25} priority src={`${CommonPath}/logo.png`} className='img-fluid' alt='logo' />
      </Link>
    </div>
  );
};
export default HeadingLogo;

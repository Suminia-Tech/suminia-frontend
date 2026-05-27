import Link from 'next/link';
import React from 'react';
import { Notamember, Signupnow } from '@/Constant';

const AddAccountLink = () => {
  return (
    <>
      <p>
        {Notamember}
        <Link href={'/page/register'} className='theme-color ps-1'>
          {Signupnow}
        </Link>
      </p>
    </>
  );
};
export default AddAccountLink;

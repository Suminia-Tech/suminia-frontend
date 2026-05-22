import React, { useState } from 'react';
import { ArrowLeft } from 'react-feather';
import { Accordion, Col } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import { Close } from '@/Constant';
import BrandFilterDropdown from '../../Shop/ShopCanvasFilter/BrandFilterDropdown';
import CustomerServices from './CustomerServices';

const LeftsideContain = ({ productData }) => {
  const [open, setOpen] = useState('1');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  return (
    <Col lg='3' md='4' className='mt-lg-5 mt-0'>
      <div className='category-option'>
        <div className='button-close mb-3'>
          <Btn attrBtn={{ className: 'btn p-0' }}>
            <ArrowLeft />
            {Close}
          </Btn>
        </div>
        <Accordion open={open} className='category-name' toggle={toggle}>
          <BrandFilterDropdown productData={productData} />
          <CustomerServices />
        </Accordion>
      </div>
    </Col>
  );
};

export default LeftsideContain;

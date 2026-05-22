import { CommonPath } from '@/Constant';
import Link from 'next/link';
import { Col } from 'reactstrap';
import DynamicRating from '../../Element/DynamicRating';
import Img from '@/Components/Element/Images';

const LeftTab = ({ elem, LeftRightTab }) => {
  return (
    <>
      {elem.childtype === 'leftbanners' && (
        <Col lg='4' md='6'>
          <div className='product-list'>
            {elem?.banners?.slice(0, 3).map((result, i) => {
              return (
                <div className={`${LeftRightTab ? LeftRightTab : 'product-box product-box1'}`} key={i}>
                  <div className='img-wrapper bg-transparent'>
                    <Link href={'/product/product_left_sidebar/21'} className='text-center'>
                      <Img src={`${CommonPath}/${result.image}`} className='img-fluid' alt='furniture' />
                    </Link>
                    <div className='circle-shape'></div>
                  </div>
                  <div className='product-details'>
                    <h3 className='theme-color'>
                      ${result.price}.00
                      <span className='font-light ms-2'>${result.mrp}.00</span>
                    </h3>
                    <Link href={'/product/product_left_sidebar/21'} className='font-default'>
                      <h5>{result.title}</h5>
                    </Link>
                    <DynamicRating data={result.ratingstars} />
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      )}
    </>
  );
};

export default LeftTab;

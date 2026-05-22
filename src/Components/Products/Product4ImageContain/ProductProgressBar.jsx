import { HurryUpLeft, instock, Orderget } from '@/Constant';
import { Progress } from 'reactstrap';
import ProductCountDown from '../../Element/ProductCountDown';

const ProductProgressBar = () => {
  return (
    <div className='mt-2 mt-md-3 border-product'>
      <h6 className='product-title hurry-title d-block'>
        {HurryUpLeft}
        <span>10</span> {instock}
      </h6>
      <Progress value={78}></Progress>
      <div className='font-light timer-5'>
        <h5>{Orderget}</h5>

        <ProductCountDown />
      </div>
    </div>
  );
};

export default ProductProgressBar;

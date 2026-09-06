import BundleCartDetails from '../ProductBundle/BundleCartDetails';
import ContainColor from './ContainColor';
import GifComponents from './GifComponents';
import ProductActions from './ProductActions';
import ProductPrice from './ProductPrice';
import ProductProgressBar from './ProductProgressBar';
import ProductSizeChart from './ProductSizeChart';
import ShareSocial from './ShareSocial';

const ProductDetailStatic = ({ bundles }) => {
  return (
    <div className='cloth-details-size'>
      <GifComponents />
      <ProductPrice />
      <ContainColor />
      <ProductSizeChart />
      <ProductActions />
      <ProductProgressBar />
      <ShareSocial />
      {bundles && <BundleCartDetails />}
    </div>
  );
};
export default ProductDetailStatic;

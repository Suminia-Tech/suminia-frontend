import Img from '@/Components/Element/Images';
import { activeView, orderIn } from '@/Constant';

const GifComponents = () => {
  return (
    <div className='product-count'>
      <ul>
        <li>
          <Img src='/assets/images/gif/fire.gif' className='img-fluid' alt='image' />
          <span className='p-counter'>37</span>
          <span className='lang'>{orderIn}</span>
        </li>
        <li>
          <Img src='/assets/images/gif/person.gif' className='img-fluid user_img' alt='image' />
          <span className='p-counter'>44</span>
          <span className='lang'>{activeView}</span>
        </li>
      </ul>
    </div>
  );
};

export default GifComponents;

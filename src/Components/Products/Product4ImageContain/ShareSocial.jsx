import { shareit } from '@/Constant';

const ShareSocial = () => {
  return (
    <div className='border-product'>
      <h6 className='product-title d-block'>{shareit}</h6>
      <div className='product-icon'>
        <ul className='product-social'>
          <li>
            <a href='https://www.facebook.com/'>
              <i className='fab fa-facebook-f'></i>
            </a>
          </li>
          <li>
            <a href='https://www.google.com/'>
              <i className='fab fa-google-plus-g'></i>
            </a>
          </li>
          <li>
            <a href='https://twitter.com/'>
              <i className='fab fa-twitter'></i>
            </a>
          </li>
          <li>
            <a href='https://www.instagram.com/'>
              <i className='fab fa-instagram'></i>
            </a>
          </li>
          <li className='pe-0'>
            <a href='https://www.google.com/'>
              <i className='fas fa-rss'></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShareSocial;

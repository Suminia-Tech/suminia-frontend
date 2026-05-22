import { Addtocart, Choosecolor, Choosesize, colorss, CommonPath, menyellowjacket, sizess, wishlist } from '@/Constant';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Container } from 'reactstrap';
import Img from '../Element/Images';

const StickyFooter = ({ productData }) => {
  const pathname = usePathname();
  const currPath = pathname;
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);
  const handleScroll = () => {
    if (window.pageYOffset > 600) {
      document.body.classList.add('stickyCart');
    } else {
      document.body.classList.remove('stickyCart');
    }
  };
  return (
    <div className='sticky-bottom-cart'>
      <Container>
        <div className='cart-content'>
          <div className='product-image'>
            <Img src={`${CommonPath}/fashion/instagram/1.jpg`} className='img-fluid' alt='instagram' />
            <div className='content'>
              <h5>{menyellowjacket}</h5>
              <h6>
                $32.96<del className='font-light'>$459.00</del>
                <span>55% off</span>
              </h6>
            </div>
          </div>
          <div className='selection-section'>
            <div className='form-group mb-0'>
              <select id='inputState' className='form-control form-select'>
                <option disabled value={Choosecolor}>
                  {Choosecolor}
                </option>
                {colorss.map((el, i) => (
                  <option defaultValue={el} key={i}>
                    {el}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group mb-0'>
              <select id='input-state' className='form-control form-select'>
                <option value={Choosesize} disabled>
                  {Choosesize}
                </option>
                {sizess.map((elem, i) => (
                  <option value={elem} key={i}>
                    {elem}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='add-btn'>
            <a className='btn default-light-theme default-theme default-theme-2 outline-button wishlist-btn' href='#javascript'>
              <i className='fas fa-heart'></i>
              {wishlist}
            </a>
            <a className='btn default-light-theme default-theme default-theme-2 outline-button' href='#javascript'>
              <i className='fas fa-shopping-cart'></i>
              {Addtocart}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StickyFooter;

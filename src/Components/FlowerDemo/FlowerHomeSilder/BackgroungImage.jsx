/* eslint-disable @next/next/no-img-element */
import { CommonPath } from '@/Constant';
import { Fragment } from 'react';
const BackgroundImage = ({ FlowerHomeSlider }) => {
  return (
    <>
      {FlowerHomeSlider.map((el, i) => {
        return (
          <Fragment key={i}>
            <div className='background-circle'>
              <img src={`${CommonPath}/${el.backgroundcircle}`} className='img-fluid' alt='flower' />
            </div>
            <div className='flower-image'>
              {el.topbottomimage.map((elem, id) => {
                return <img src={`${CommonPath}/${elem.image}`} key={id} className={elem.class} alt='flower' />;
              })}
            </div>
          </Fragment>
        );
      })}
    </>
  );
};
export default BackgroundImage;

import { useEffect, useState } from 'react';
import { Media } from 'reactstrap';
import { CommonPath, FloralDress, Somerecentlypurchase, minutesago } from '@/Constant';
import Img from '../Element/Images';

const RecentNotification = () => {
  const [isValue, setIsValue] = useState(false);
  useEffect(() => {
    const Timer = setInterval(() => {
      setIsValue(!isValue);
    }, 5000);
    return () => {
      clearInterval(Timer);
    };
  }, [isValue]);
  return (
    <div className={`recently-purchase d-md-flex d-none${isValue ? ' show' : ''}`}>
      <Img src={`${CommonPath}/fashion/instagram/3.jpg`} className='img-fluid' alt='instagram' />
      <Media body>
        <div>
          <h4>{Somerecentlypurchase}</h4>
          <a href='#javascript'>
            <span className='product-name'>{FloralDress}</span>
          </a>
          <small className='timeAgo'>{minutesago}</small>
        </div>
      </Media>
      <a href='#javascript' className='close-popup fa fa-times' onClick={() => setIsValue(!isValue)}></a>
    </div>
  );
};

export default RecentNotification;

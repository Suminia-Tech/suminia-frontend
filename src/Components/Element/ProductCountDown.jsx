/* eslint-disable react-hooks/exhaustive-deps */
import { Days, Hour, Min, Sec } from '@/Constant';
import { useEffect, useState } from 'react';

const ProductCountDown = () => {
  const countDownDate = new Date('Jan 5, 2023 15:37:25').getTime();
  const [countdowns, setCountDown] = useState({ days: 0, hrs: 0, mins: 0, sec: 0, completed: false });
  useEffect(() => {
    const intervals = setInterval(() => {
      const currentDate = new Date().getTime();

      const difference = countDownDate - currentDate;

      setCountDown({
        ...countdowns,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        sec: Math.floor((difference % (1000 * 60)) / 1000),
      });

      if (difference < 0) {
        setCountDown({ ...countdowns, completed: true });
      }
    }, 1000);
    return () => {
      clearInterval(intervals);
    };
  }, []);
  return (
    <ul className='timer1'>
      <li className='counter'>
        <h5 id='days'> {countdowns.days}</h5> {Days} :
      </li>
      <li className='counter'>
        <h5 id='hours'>{countdowns.hrs}</h5> {Hour} :
      </li>
      <li className='counter'>
        <h5 id='minutes'>{countdowns.mins}</h5> {Min} :
      </li>
      <li className='counter'>
        <h5 id='seconds'>{countdowns.sec}</h5> {Sec}
      </li>
    </ul>
  );
};

export default ProductCountDown;

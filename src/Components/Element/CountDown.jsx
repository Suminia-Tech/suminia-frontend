/* eslint-disable react-hooks/exhaustive-deps */
import { Days, Hour, Min, Sec } from '@/Constant';
import { useEffect, useState } from 'react';

const CountDown = ({ customeclass, themeColor }) => {
  const countDownDate = new Date('Feb 1, 2023 15:37:25').getTime();
  const [countdowns, setCountDown] = useState({
    days: 0,
    hrs: 0,
    mins: 0,
    sec: 0,
    completed: false,
  });
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
    <ul className={`${customeclass ? customeclass : ''}`}>
      <li>
        <div className='counter'>
          <div>
            <h2 id='days1' className={themeColor ? 'theme-color' : ''}>
              {countdowns.days}
            </h2>
            {Days}
          </div>
        </div>
      </li>
      <li>
        <div className='counter'>
          <div>
            <h2 id='hours1' className={themeColor ? 'theme-color' : ''}>
              {countdowns.hrs}
            </h2>
            {Hour}
          </div>
        </div>
      </li>
      <li>
        <div className='counter'>
          <div>
            <h2 id='minutes1' className={themeColor ? 'theme-color' : ''}>
              {countdowns.mins}
            </h2>
            {Min}
          </div>
        </div>
      </li>
      <li>
        <div className='counter'>
          <div>
            <h2 id='seconds1' className={themeColor ? 'theme-color' : ''}>
              {countdowns.sec}
            </h2>
            {Sec}
          </div>
        </div>
      </li>
    </ul>
  );
};
export default CountDown;

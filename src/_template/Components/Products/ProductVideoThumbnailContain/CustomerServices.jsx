import React from 'react';
import { customerServiceData } from '../../../Data/CustomerServiceData';

const CustomerServices = () => {
  return (
    <div className='accordion-item service-accorion'>
      <div id='collapseFour' className='accordion-collapse collapse show'>
        <div className='accordion-body'>
          <ul className='category-list'>
            {customerServiceData &&
              customerServiceData.map((elem) => (
                <li key={elem.id}>
                  <div className='service-wrap'>
                    <div className='service-icon'>
                      <svg>
                        <use xlinkHref={elem.svg}></use>
                      </svg>
                    </div>
                    <div className='service-content'>
                      <h3>{elem.title}</h3>
                      <span className='font-light'>{elem.desp}</span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerServices;

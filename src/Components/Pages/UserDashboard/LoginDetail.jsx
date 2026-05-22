import React from 'react';

const LoginDetail = ({ item, openProfileModal }) => {
  return (
    <ul className='dash-profile'>
      {item.details.map((elem, i) => {
        return (
          <li key={i}>
            <div className='left'>
              <h6 className='font-light'>{elem.title}</h6>
            </div>
            <div className='right'>
              <h6>{elem.detail}</h6>
            </div>
            <a href='#javascript' onClick={() => openProfileModal()}>{item.btn}</a>
          </li>
        );
      })}
    </ul>
  );
};

export default LoginDetail;

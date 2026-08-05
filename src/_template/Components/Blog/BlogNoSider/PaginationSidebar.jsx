import React from 'react';
import { Col } from 'reactstrap';

const PaginationSidebar = () => {
  return (
    <Col xs='12'>
      <nav className='page-section'>
        <ul className='pagination'>
          <li className='page-item'>
            <a className='page-link'>
              <span aria-hidden='true'>
                <i className='fas fa-chevron-left'></i>
              </span>
            </a>
          </li>
          <li className='page-item active'>
            <a className='page-link'>1</a>
          </li>
          <li className='page-item'>
            <a className='page-link'>2</a>
          </li>
          <li className='page-item'>
            <a className='page-link'>3</a>
          </li>
          <li className='page-item'>
            <a className='page-link'>
              <span aria-hidden='true'>
                <i className='fas fa-chevron-right'></i>
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </Col>
  );
};

export default PaginationSidebar;

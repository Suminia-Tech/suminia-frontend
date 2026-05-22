import React from 'react';
import { Col } from 'reactstrap';
import LeftCategory from './LeftCategory';
import LeftPopularCard from './LeftPopularCard';
import LeftSearch from './LeftSearch';

const LeftSidebar = () => {
  return (
    <Col lg='3' md='4'>
      <div className='left-side'>
        <LeftSearch />
        <LeftPopularCard />
        <LeftCategory />
      </div>
    </Col>
  );
};

export default LeftSidebar;

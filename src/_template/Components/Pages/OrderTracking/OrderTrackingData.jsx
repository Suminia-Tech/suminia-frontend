import React from 'react';
import { Col } from 'reactstrap';
import { orderHeadColumn, orderHeadData } from '../../../Data/OrderTrackingData';
import DataTables from '../../Element/DataTable';

const OrderTrackingData = () => {
  return (
    <Col xs='12' className='overflow-visible'>
      <div className='tracker-table'>
        <div className='table-responsive'>
          <DataTables columns={orderHeadColumn} data={orderHeadData} />
        </div>
      </div>
    </Col>
  );
};

export default OrderTrackingData;

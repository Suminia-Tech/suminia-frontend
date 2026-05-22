/* eslint-disable react/no-unescaped-entities */
import React, { Fragment } from 'react';
import { headDashboardColumn, headDashboardData } from '../../../Data/DashboardData';
import { MyOrder } from '@/Constant';
import DataTables from '../../Element/DataTable';

const OrderContain = () => {
  return (
    <Fragment>
      <div className='box-head mb-3'>
        <h3>{MyOrder}</h3>
      </div>
      <div className='table-responsive'>
        <DataTables data={headDashboardData} columns={headDashboardColumn} />
      </div>
    </Fragment>
  );
};

export default OrderContain;

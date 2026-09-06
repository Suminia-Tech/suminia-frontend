import React, { Fragment } from 'react';

const CommentDetails = ({ elem }) => {
  return (
    <Fragment>
      <div className='blog-profile box-center mb-lg-5 mb-4'>
        <div className='image-name text-weight'>
          <h3>Camilo Galvis</h3>
          <h6>{elem?.date}</h6>
        </div>
      </div>
    </Fragment>
  );
};

export default CommentDetails;

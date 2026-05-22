import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonPath, ProductAdded } from '@/Constant';
import Img from '@/Components/Element/Images';
import { NOTIFICATIONALTER } from '@/ReduxToolkit/Reducers/ModalReducer';

const NotificationModal = () => {
  const dispatch = useDispatch();
  const { notificationAlert, notificationData } = useSelector((state) => state.ModalReducer);
  useEffect(() => {
    if (notificationData?.length > 0) {
      setTimeout(() => {
        dispatch(NOTIFICATIONALTER(false));
      }, 5000);
    }
  }, [dispatch, notificationAlert, notificationData?.length]);
  return (
    <div className={`added-notification ${notificationAlert ? 'show' : ''}`}>
      {notificationData &&
        notificationData?.length > 0 &&
        notificationData?.map((elem) => {
          return elem?.images?.slice(0, 1).map((item, i) => <Img key={i} src={`${CommonPath}/${item.src}`} className='img-fluid' alt='notification' />);
        })}
      <h3>{ProductAdded}</h3>
    </div>
  );
};

export default NotificationModal;

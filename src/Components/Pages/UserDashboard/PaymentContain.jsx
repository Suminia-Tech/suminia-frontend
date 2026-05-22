import React, { Fragment } from "react";
import { UserDashboardData } from "../../../Data/UserDashboardData";
import { useDispatch } from "react-redux";
import { Btn } from "../../AbstractElements";
import CardDetails from "./CardDetails";
import { PAYMENTCARDMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const PaymentContain = () => {
  const PaymentFilter = UserDashboardData.filter((el) => el.type === "Payment");
  const dispatch = useDispatch();
  const openPaymentModal = () => {
    dispatch(PAYMENTCARDMODAL());
  };
  return (
    <Fragment>
      {PaymentFilter.map((item, i) => {
        return (
          <Fragment key={i}>
            <div className="box-head">
              <h3>{item.head}</h3>
              <Btn attrBtn={{ className: "btn-solid-default btn-sm fw-bold ms-auto", onClick: openPaymentModal }}>
                <i className="fas fa-plus"></i> {item.btn}
              </Btn>
            </div>
            <CardDetails item={item} openPaymentModal={openPaymentModal} />
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default PaymentContain;

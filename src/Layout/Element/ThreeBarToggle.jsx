import { OVERLAY, TOPMENUTOGGLE } from "@/ReduxToolkit/Reducers/ModalReducer";
import React from "react";
import { useDispatch } from "react-redux";

const ThreeBarToggle = ({ customClass }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(TOPMENUTOGGLE());
    dispatch(OVERLAY());
  };
  return (
    <div className={`toggle-nav ${customClass ? customClass : ""}`} onClick={() => handleClick()}>
      <i className="fa fa-bars sidebar-bar"></i>
    </div>
  );
};

export default ThreeBarToggle;

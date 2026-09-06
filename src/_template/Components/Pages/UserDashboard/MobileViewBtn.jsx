import React from "react";
import { useDispatch } from "react-redux";
import useWindowDimensions from "../../../Utils/useWindowDimensions";
import { Btn } from "../../AbstractElements";
import { ShowMenu } from "@/_template/Constant";
import { ISDASHBOARD, OVERLAY } from "@/_template/ReduxToolkit/Reducers/ModalReducer";

const MobileViewBtn = () => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  return (
    <div
      className="filter-button dash-filter dashboard"
      onClick={() => {
        width < 1200 && dispatch(ISDASHBOARD());
        dispatch(OVERLAY());
      }}
    >
      <Btn attrBtn={{ className: "btn-solid-default btn-sm fw-bold filter-btn" }}>{ShowMenu}</Btn>
    </div>
  );
};

export default MobileViewBtn;

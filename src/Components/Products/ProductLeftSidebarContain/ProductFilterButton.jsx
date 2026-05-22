import React from "react";
import { AlignLeft } from "react-feather";
import { useDispatch } from "react-redux";
import { Btn } from "../../AbstractElements";
import { Filter } from "@/Constant";
import { OVERLAY, PRODUCTPAGEFILTER } from "@/ReduxToolkit/Reducers/ModalReducer";

const ProductFilterButton = () => {
  const dispatch = useDispatch();
  return (
    <div className="filter-button mb-3">
      <Btn
        attrBtn={{
          className: "danger-button danger-center btn btn-sm filter-btn",
          onClick: () => {
            dispatch(PRODUCTPAGEFILTER());
            dispatch(OVERLAY());
          },
        }}
      >
        <AlignLeft /> {Filter}
      </Btn>
    </div>
  );
};

export default ProductFilterButton;

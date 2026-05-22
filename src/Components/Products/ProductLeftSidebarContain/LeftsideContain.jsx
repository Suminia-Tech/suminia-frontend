import { Close } from "@/Constant";
import { useState } from "react";
import { ArrowLeft } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Col } from "reactstrap";
import { Btn } from "../../AbstractElements";
import BrandFilterDropdown from "../../Shop/ShopCanvasFilter/BrandFilterDropdown";
import CustomerServices from "./CustomerServices";
import { OVERLAY, PRODUCTPAGEFILTER } from "@/ReduxToolkit/Reducers/ModalReducer";

const LeftsideContain = ({ productData }) => {
  const [open, setOpen] = useState("1");
  const { ProductFilter } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  return (
    <Col lg="3" md="4" className="mt-lg-5 mt-0">
      <div className={`category-option ${ProductFilter ? "show" : ""}`}>
        <div className="button-close mb-3">
          <Btn
            attrBtn={{
              className: "p-0",
              onClick: () => {
                dispatch(PRODUCTPAGEFILTER());
                dispatch(OVERLAY());
              },
            }}
          >
            <ArrowLeft />
            {Close}
          </Btn>
        </div>
        <Accordion className="category-name" open={open} toggle={toggle}>
          <BrandFilterDropdown productData={productData} />
          <CustomerServices />
        </Accordion>
      </div>
    </Col>
  );
};

export default LeftsideContain;

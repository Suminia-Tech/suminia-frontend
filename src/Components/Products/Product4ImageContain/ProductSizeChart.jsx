import { pleaseselectsize, quentityname, selectsize, sizechart, Sizes } from "@/Constant";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "reactstrap";
import { Btn } from "../../AbstractElements";
import { SIZEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const ProductSizeChart = () => {
  const [count, setCount] = useState(1);
  const [sizes, setSizes] = useState("");
  const dispatch = useDispatch();
  const handleClick = (value) => {
    setSizes(value);
  };
  return (
    <div id="selectSize" className="addeffect-section product-description border-product">
      <h6 className="product-title size-text">
        {selectsize}
        <span onClick={() => dispatch(SIZEMODAL())}>
          <a href="#javascript">{sizechart}</a>
        </span>
      </h6>

      <h6 className="error-message">{pleaseselectsize}</h6>

      <div className="size-box">
        <ul>
          {Sizes.map((el, i) => (
            <li key={i} onClick={() => handleClick(el)} className={sizes === el ? "active" : ""}>
              <a>{el}</a>
            </li>
          ))}
        </ul>
      </div>

      <h6 className="product-title product-title-2 d-block">{quentityname}</h6>
      <div className="qty-box">
        <div className="input-group">
          <span className="input-group-prepend">
            <Btn
              attrBtn={{
                type: "button",
                className: "quantity-left-minus",
                onClick: () => {
                  setCount((prev) => (count !== 1 ? prev - 1 : 1));
                },
              }}
            >
              <i className="fas fa-minus"></i>
            </Btn>
          </span>
          <Input type="text" name="quantity" className="form-control input-number" min={0} value={count} readOnly />
          <span className="input-group-prepend">
            <Btn
              attrBtn={{
                type: "button",
                className: "quantity-right-plus",
                onClick: () => {
                  setCount((prev) => (prev < 15 ? count + 1 : 15));
                },
              }}
            >
              <i className="fas fa-plus"></i>
            </Btn>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductSizeChart;

import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Label } from "reactstrap";
import { Brand } from "@/Constant";
import { BRANDFILTER } from "@/ReduxToolkit/Reducers/ProductFilterReducer";

const AllBrands = ({ productData, setIsNum, isNum }) => {
  var count = 0;
  const dispatch = useDispatch();
  const BrandFilter = [...new Set([...productData?.map((elem) => elem.brand)])];
  const { brand } = useSelector((state) => state.ProductFilter);
  const handleBrandChange = (e) => {
    dispatch(BRANDFILTER({ checked: e.target.checked, value: e.target.value }));
  };
  const onShow = (val) => {
    if (val !== isNum) {
      setIsNum(val);
    } else {
      setIsNum(0);
    }
  };
  return (
    <li className={`onclick-title${isNum === 2 ? " show" : ""}`}>
      <h6 onClick={() => onShow(2)}>{Brand}</h6>
      <ul className="onclick-content">
        {BrandFilter &&
          BrandFilter.map((elem, i) => {
            return (
              <Fragment key={i}>
                {elem !== "none" && (
                  <li>
                    <div className="form-check custome-form-check">
                      <Input className="checkbox_animated check-it" type="checkbox" id={elem} defaultValue={elem} checked={brand.includes(elem)} onChange={(e) => handleBrandChange(e)} />
                      <Label className="form-check-label" htmlFor={elem}>
                        {elem}
                      </Label>
                      <p className="font-light">
                        {productData.map((product, i) => {
                          product?.brand == elem && count++;
                          count = "";
                          return productData.length == i + 1 ? count : "";
                        })}
                      </p>
                    </div>
                  </li>
                )}
              </Fragment>
            );
          })}
      </ul>
    </li>
  );
};

export default AllBrands;

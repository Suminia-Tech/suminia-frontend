import { Category } from "@/Constant";
import { CATEGORYFILTER } from "@/ReduxToolkit/Reducers/ProductFilterReducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Label } from "reactstrap";

const AllCategories = ({ productData, setIsNum, isNum }) => {
  const [allCategory, setAllCategory] = useState(["All"]);
  const { category } = useSelector((state) => state.ProductFilter);
  const dispatch = useDispatch();
  useEffect(() => {
    productData?.map((el) => setAllCategory((prev) => Array.from(new Set([...prev, el?.type]))));
  }, [productData]);
  const handleChange = (event) => {
    dispatch(CATEGORYFILTER({ checked: event.target.checked, value: event.target.value }));
  };
  const onShow = (val) => {
    if (val !== isNum) {
      setIsNum(val);
    } else {
      setIsNum(0);
    }
  };
  return (
    <li className={`onclick-title${isNum === 1 ? " show" : ""}`}>
      <h6 onClick={() => onShow(1)}>{Category}</h6>
      <ul className="onclick-content">
        {allCategory &&
          allCategory.map((elem, i) => {
            return (
              <li key={i}>
                <div className="form-check custome-form-check">
                  <Input className="checkbox_animated check-it" type="checkbox" id={elem} value={elem} checked={category.includes(elem)} onChange={(e) => handleChange(e)} />
                  <Label className="form-check-label" htmlFor={elem}>
                    {elem}
                  </Label>
                  <p className="font-light"></p>
                </div>
              </li>
            );
          })}
      </ul>
    </li>
  );
};

export default AllCategories;

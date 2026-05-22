import { Discount } from "@/Constant";
import { DISCOUNTFILTER } from "@/ReduxToolkit/Reducers/ProductFilterReducer";
import { useDispatch, useSelector } from "react-redux";
import { Input, Label } from "reactstrap";

const FilterDiscount = ({ setIsNum, isNum }) => {
  const { discount } = useSelector((state) => state.ProductFilter);
  const onShow = (val) => {
    if (val !== isNum) {
      setIsNum(val);
    } else {
      setIsNum(0);
    }
  };
  const discountData = [
    {
      id: 1,
      name: "5% and above",
      data: 5,
    },
    {
      id: 2,
      name: "10% and above",
      data: 10,
    },
    {
      id: 3,
      name: "20% and above",
      data: 20,
    },
  ];
  const dispatch = useDispatch();
  const onDiscountChange = (e, val) => {
    dispatch(DISCOUNTFILTER({ checked: e.target.checked, value: val }));
  };
  return (
    <li className={`onclick-title${isNum === 4 ? " show" : ""}`}>
      <h6 onClick={() => onShow(4)}>{Discount}</h6>
      <ul className="onclick-content">
        {discountData?.map((elem) => {
          return (
            <li key={elem.id}>
              <div className="form-check custome-form-check">
                <Input className="checkbox_animated check-it" type="checkbox" defaultValue={elem.data} defaultChecked={discount.includes(elem.data)} id={elem.id} onClick={(e) => onDiscountChange(e, elem.data)} />
                <Label className="form-check-label" htmlFor={elem.id}>
                  {elem.name}
                </Label>
              </div>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default FilterDiscount;

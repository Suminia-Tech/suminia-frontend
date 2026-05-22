import { DiscountRange } from "@/Constant";
import { DISCOUNTFILTER } from "@/ReduxToolkit/Reducers/ProductFilterReducer";
import { useDispatch, useSelector } from "react-redux";
import { AccordionBody, AccordionHeader, AccordionItem, Input, Label } from "reactstrap";

const DiscountRangeFilter = ({ productData }) => {
  const { discount } = useSelector((state) => state.ProductFilter);
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
    <AccordionItem>
      <AccordionHeader targetId="5">{DiscountRange}</AccordionHeader>
      <AccordionBody accordionId="5">
        <ul className="category-list">
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
      </AccordionBody>
    </AccordionItem>
  );
};

export default DiscountRangeFilter;

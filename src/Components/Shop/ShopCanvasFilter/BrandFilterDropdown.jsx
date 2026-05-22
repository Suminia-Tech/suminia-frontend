import { Brand } from "@/Constant";
import { BRANDFILTER } from "@/ReduxToolkit/Reducers/ProductFilterReducer";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AccordionBody, AccordionHeader, AccordionItem, Input, Label } from "reactstrap";

const BrandFilterDropdown = ({ productData }) => {
  var count = 0;
  const dispatch = useDispatch();
  const BrandFilter = [...new Set([...productData?.map((elem) => elem.brand)])];
  const { brand } = useSelector((state) => state.ProductFilter);
  const handleBrandChange = (e) => {
    dispatch(BRANDFILTER({ checked: e.target.checked, value: e.target.value }));
  };
  return (
    <AccordionItem className="category-rating">
      <AccordionHeader targetId="1">{Brand}</AccordionHeader>
      <AccordionBody accordionId="1" className="category-scroll">
        <ul className="category-list">
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
      </AccordionBody>
    </AccordionItem>
  );
};

export default BrandFilterDropdown;

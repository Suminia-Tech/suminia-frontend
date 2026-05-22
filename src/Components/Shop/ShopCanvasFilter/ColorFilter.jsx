import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";
import { Color } from "@/Constant";
import { COLORFILTER } from "@/ReduxToolkit/Reducers/ProductFilterReducer";

const ColorFilter = ({ productData }) => {
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state.ProductFilter);
  const [colorArray, setColorArray] = useState([]);
  useEffect(() => {
    productData?.map((el) => setColorArray((prev) => Array.from(new Set([...prev, ...el?.colors]))));
  }, [productData]);
  return (
    <AccordionItem className="category-color">
      <AccordionHeader targetId="2">{Color}</AccordionHeader>
      <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
        <AccordionBody accordionId="2">
          <ul className="category-list">
            {colorArray?.map((elem, i) => (
              <li className={`${color?.includes(elem) ? "active" : ""}`} key={i}>
                <a href="#javascript" style={{ background: elem }} onClick={() => dispatch(COLORFILTER(elem))}>
                  <i className="fas fa-check"></i>
                </a>
              </li>
            ))}
          </ul>
        </AccordionBody>
      </div>
    </AccordionItem>
  );
};

export default ColorFilter;

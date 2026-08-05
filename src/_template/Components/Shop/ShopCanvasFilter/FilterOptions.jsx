import { useState } from "react";
import { Accordion, UncontrolledAccordion } from "reactstrap";
import BrandFilterDropdown from "./BrandFilterDropdown";
import CategoryFilter from "./CategoryFilter";
import ColorFilter from "./ColorFilter";
import DiscountRangeFilter from "./DiscountRangeFilter";
import PriceRange from "./PriceRange";

const FilterOptions = ({ productData }) => {
  const [open, setOpen] = useState("1");
  const toggle = (id) => {
    if (open === id) {
      setOpen("1");
    } else {
      setOpen(id);
    }
  };
  return (
    <Accordion open={open} className="category-name" toggle={toggle}>
      <UncontrolledAccordion defaultOpen={["1", "2", "3", "4", "5"]} stayOpen>
        <BrandFilterDropdown productData={productData} />
        <ColorFilter productData={productData} />
        <PriceRange productData={productData} />
        <CategoryFilter productData={productData} />
        <DiscountRangeFilter productData={productData} />
      </UncontrolledAccordion>
    </Accordion>
  );
};

export default FilterOptions;

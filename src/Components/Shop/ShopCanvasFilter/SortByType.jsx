import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { getAPIData } from "@/Utils";
import { useDispatch } from "react-redux";
import { CATEGORY } from "@/ReduxToolkit/Reducers/ProductFilterReducer";

const SortByType = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [getProducts, setGetProducts] = useState([]);
  const [Features, setFeatures] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getAPIData(`/api/products`).then((res) => {
      setGetProducts(res?.data);
    });
  }, []);
  useEffect(() => {
    getProducts?.map((el) => setFeatures((prev) => Array.from(new Set([...prev, el?.type]))));
  }, [getProducts]);
  return (
    <Dropdown className="select-featured" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle className="dropdown-toggle">
        <span>{"Select Featured"}</span> <i className="fas fa-angle-down ms-lg-3 ms-2"></i>
      </DropdownToggle>
      <DropdownMenu>
        {Features &&
          Features.map((elem, i) => {
            return (
              <DropdownItem key={i} onClick={() => dispatch(CATEGORY([elem]))}>
                {elem}
              </DropdownItem>
            );
          })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SortByType;

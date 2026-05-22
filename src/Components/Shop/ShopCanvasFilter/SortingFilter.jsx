import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import GridContain from "./GridContain";
import SortByType from "./SortByType";
import { SORTINGFILTER } from "@/ReduxToolkit/Reducers/ProductFilterReducer";

const SortingFilter = ({ grid5, listGrid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { sorting } = useSelector((state) => state.ProductFilter);
  const SortData = [
    {
      id: 1,
      sort: "Select Sorting",
    },
    {
      id: 2,
      sort: "Alphabetically A-Z",
    },
    {
      id: 3,
      sort: "Alphabetically Z-A",
    },
    {
      id: 4,
      sort: "Price, High To Low",
    },
    {
      id: 5,
      sort: "Price, Low To High",
    },
  ];
  return (
    <Col xs="12">
      <div className="filter-options">
        <div className="select-options">
          <div className="page-view-filter">
            <Dropdown className="select-featured" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
              <DropdownToggle className="dropdown-toggle">
                <span>{sorting}</span> <i className="fas fa-angle-down ms-lg-3 ms-2"></i>
              </DropdownToggle>
              <DropdownMenu>
                {SortData &&
                  SortData.map((elem) => (
                    <DropdownItem key={elem.id} onClick={() => dispatch(SORTINGFILTER(elem.sort))}>
                      {elem.sort}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <SortByType />
        </div>
        <GridContain grid5={grid5} listGrid={listGrid} />
      </div>
    </Col>
  );
};

export default SortingFilter;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { allCurrency } from "../../Data/TopHeaderData";
import { CURRENCYCHANGE } from "@/ReduxToolkit/Reducers/CurrencyReducer";

const TopHeaderCurrency = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const onHandleClick = (value) => {
    dispatch(CURRENCYCHANGE(value));
  };
  return (
    <li>
      <Dropdown className="top-header-dropdown" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle>
          <span>
            <b>$</b> Dollar
          </span>
          <i className="fas fa-chevron-down"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {allCurrency.map((elem, i) => {
            return (
              <DropdownItem key={i}>
                <a className="d-block" onClick={() => onHandleClick(elem)}>
                  {elem.currency}
                </a>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </li>
  );
};

export default TopHeaderCurrency;

import { allCurrency } from "@/Data/TopHeaderData";
import { CURRENCYCHANGE } from "@/ReduxToolkit/Reducers/CurrencyReducer";
import { DollarSign } from "react-feather";
import { useDispatch } from "react-redux";

const Currency = () => {
  const dispatch = useDispatch();
  const onHandleClick = (value) => dispatch(CURRENCYCHANGE(value));

  return (
    <li className="onhover-dropdown small-dropdown">
      <div className="cart-media">
        <a href="#javascript">
          <DollarSign />
        </a>
      </div>
      <div className="onhover-div profile-dropdown">
        <ul>
          {allCurrency.map((elem, i) => {
            return (
              <li key={i}>
                <a href="#javascript" className="d-block" onClick={() => onHandleClick(elem)}>
                  {elem.currency}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
};
export default Currency;

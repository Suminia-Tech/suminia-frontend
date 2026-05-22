/* eslint-disable react-hooks/exhaustive-deps */
import Img from "@/Components/Element/Images";
import { SET_GRID } from "@/ReduxToolkit/Reducers/AllGridsReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const GridContain = ({ grid5, listGrid }) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(grid5 && !listGrid ? 4 : listGrid ? 5 : 3);

  useEffect(() => {
    if (!listGrid && grid5) dispatch(SET_GRID("row-cols-lg-4 row-cols-md-3 row-cols-xl-5"));
    else if (!listGrid && !grid5) dispatch(SET_GRID("row-cols-lg-4 row-cols-md-3"));
    else dispatch(SET_GRID("row-cols-lg-4 row-cols-md-3 row-cols-xl-5 list-style"));
  }, []);

  const getGrid = (value, num) => {
    setActive(num);
    dispatch(SET_GRID(value));
  };

  return (
    <div className="grid-options d-sm-inline-block d-none">
      <ul className="d-flex">
        <li className={`two-grid ${active === 1 ? "active" : ""}`} onClick={() => getGrid("row-cols-2", 1)}>
          <a href="#javascript">
            <Img src="/assets/svg/grid-2.svg" className="img-fluid" alt="grid" />
          </a>
        </li>
        <li className={`three-grid d-md-inline-block d-none ${active === 2 ? "active" : ""}`} onClick={() => getGrid("row-cols-md-3", 2)}>
          <a href="#javascript">
            <Img src="/assets/svg/grid-3.svg" className="img-fluid" alt="grid" />
          </a>
        </li>
        <li className={`grid-btn d-lg-inline-block d-none ${active === 3 ? "active" : ""}`} onClick={() => getGrid("row-cols-lg-4 row-cols-md-3", 3)}>
          <a href="#javascript">
            <Img src="/assets/svg/grid.svg" className="img-fluid" alt="grid" />
          </a>
        </li>
        {grid5 ? (
          <li className={`five-grid d-xl-inline-block d-none ${active === 4 ? "active" : ""}`} onClick={() => getGrid("row-cols-lg-4 row-cols-md-3 row-cols-xl-5", 4)}>
            <a href="#javascript">
              <Img src="/assets/svg/grid-5.svg" className="img-fluid" alt="grid" />
            </a>
          </li>
        ) : (
          ""
        )}
        {listGrid ? (
          <li className={`list-btn ${active === 5 ? "active" : ""}`} onClick={() => getGrid("row-cols-lg-4 row-cols-md-3 row-cols-xl-5 list-style", 5)}>
            <a href="#javascript">
              <Img src="/assets/svg/list.svg" className="img-fluid" alt="grid" />
            </a>
          </li>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
};

export default GridContain;

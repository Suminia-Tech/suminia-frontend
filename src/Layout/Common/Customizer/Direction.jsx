import { useState } from "react";
import { useDispatch } from "react-redux";
import { LTR, RTL } from "@/Constant";
import { Btn } from "@/Components/AbstractElements";
import { ISDIRECTION } from "@/ReduxToolkit/Reducers/ThemeCustomizerReducer";

const Direction = () => {
  const [isDir, setIsDir] = useState("ltr");
  const dispatch = useDispatch();
  const onHandleClick = (value) => {
    setIsDir(value);
    if (value === "ltr") {
      localStorage.setItem("direction", "ltr");
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
      document.documentElement.dir = "ltr";
      dispatch(ISDIRECTION("ltr"));
    } else {
      localStorage.setItem("direction", "rtl");
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
      document.documentElement.dir = "rtl";
      dispatch(ISDIRECTION("rtl"));
    }
  };
  return (
    <li>
      {isDir === "ltr" ? (
        <Btn
          attrBtn={{
            className: "btn-sm rtl-button",
            onClick: () => onHandleClick("rtl"),
          }}
        >
          {RTL}
        </Btn>
      ) : (
        <Btn
          attrBtn={{
            className: "btn-sm rtl-button",
            onClick: () => onHandleClick("ltr"),
          }}
        >
          {LTR}
        </Btn>
      )}
    </li>
  );
};
export default Direction;

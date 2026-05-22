import { ISPRIMARYCOLOR } from "@/ReduxToolkit/Reducers/ThemeCustomizerReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "reactstrap";

const ColorSelect = () => {
  const [colour, setColour] = useState("#e22454");
  const dispatch = useDispatch();
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", colour);
  }, [colour]);
  const handleChange = (e) => {
    setColour(e.target.value);
    dispatch(ISPRIMARYCOLOR(e.target.value));
  };
  return (
    <li className="color-picker">
      <Input type="color" className="form-control-color" value={colour} onChange={(e) => handleChange(e)} title="Choose your color" />
    </li>
  );
};
export default ColorSelect;

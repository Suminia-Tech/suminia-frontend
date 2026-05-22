import { OVERLAY, RESETOVERLAY } from "@/ReduxToolkit/Reducers/ModalReducer";
import { useDispatch, useSelector } from "react-redux";

const Overlay = () => {
  const { overlay } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  const onHandleClick = () => {
    dispatch(OVERLAY(false));
    dispatch(RESETOVERLAY());
  };
  return <div className={`bg-overlay${overlay ? " show" : ""}`} onClick={() => onHandleClick()}></div>;
};
export default Overlay;

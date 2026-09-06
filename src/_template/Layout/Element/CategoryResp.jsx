import { CategoryList } from "@/_template/Constant";
import { CATEGORYRESPONSIVE, OVERLAY } from "@/_template/ReduxToolkit/Reducers/ModalReducer";
import useWindowDimensions from "@/_template/Utils/useWindowDimensions";
import { useDispatch } from "react-redux";

const CategoryResp = () => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const toggleModal = () => {
    if (width > 1200) {
      dispatch(CATEGORYRESPONSIVE());
      dispatch(OVERLAY());
    }
  };
  return (
    <div className="close-btn d-xl-none" onClick={() => toggleModal()}>
      {CategoryList}
      <span className="back-category">
        <i className="fa fa-angle-left"></i>
      </span>
    </div>
  );
};

export default CategoryResp;

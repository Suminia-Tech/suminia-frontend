import { Filter } from "@/Constant";
import { AlignLeft } from "react-feather";
import { useDispatch } from "react-redux";
import { Btn } from "../../AbstractElements";
import { IS_OFFSET, OVERLAY } from "@/ReduxToolkit/Reducers/ModalReducer";

const FilterButton = ({ customClass }) => {
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(IS_OFFSET());
    dispatch(OVERLAY());
  };
  return (
    <div className={customClass ? customClass : "hide-button mb-3"}>
      <Btn attrBtn={{ className: "danger-button danger-center btn btn-sm", onClick: toggle }}>
        <AlignLeft className="me-2" /> {Filter}
      </Btn>
    </div>
  );
};

export default FilterButton;

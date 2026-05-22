import { IS_MODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
import React from "react";
import { Eye } from "react-feather";
import { useDispatch } from "react-redux";

const ModelViewProduct = ({ elem }) => {
  const dispatch = useDispatch();
  const ModelOpen = (e) => {
    e.preventDefault();
    dispatch(IS_MODAL(elem));
  };
  return (
    <li
      onClick={(e) => {
        ModelOpen(e);
      }}
    >
      <a href="#javascript">
        <Eye />
      </a>
    </li>
  );
};

export default ModelViewProduct;

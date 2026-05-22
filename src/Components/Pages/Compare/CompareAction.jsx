import React from "react";
import { deleteProduct } from "../../../Utils";
import { Remove } from "@/Constant";
import AddtoCartBtn from "../../Element/AddtoCartBtn";
import { CHANGECOMPARE } from "@/ReduxToolkit/Reducers/CompareReducer";
import { useDispatch } from "react-redux";

const CompareAction = ({ setComapreData, comapreData }) => {
  const dispatch = useDispatch();
  const handleDelete = (id, e) => {
    deleteProduct(`/api/remove/compare/${id}`)
      .then((res) => {
        if (res?.data) {
          dispatch(CHANGECOMPARE(res?.data));
          let compareProducts = JSON.parse(localStorage.getItem("compareProducts")) || [];
          compareProducts = compareProducts.filter((index) => index !== id);
          localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
        }
      })
      .catch((error) => {
        return error;
      });
  };

  return (
    <tr className="table-cart-button">
      <td></td>
      {comapreData?.map((elem, i) => (
        <td key={i}>
          <a className="btn btn-solid-blue mb-2" onClick={(e) => handleDelete(elem.id, e)}>
            - {Remove}
          </a>
          <AddtoCartBtn customeclass={"btn btn-solid-blue"} data={elem} />
        </td>
      ))}
    </tr>
  );
};

export default CompareAction;

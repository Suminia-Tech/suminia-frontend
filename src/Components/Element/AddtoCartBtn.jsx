import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Btn } from "@/Components/AbstractElements";
import { Addtocart } from "@/Constant";
import { ADDTOCART } from "@/ReduxToolkit/Reducers/AddtoCartReducer";

const AddtoCartBtn = ({ customeclass, data, btn }) => {
  const dispatch = useDispatch();
  const addProduct = useSelector((state) => state.AddToCartReducer.product);
  const AddtoCart = () => {
    axios
      .post(`/api/addtocart`, { id: data?.id })
      .then((res) => {
        const updatedCartlist = [...addProduct, data?.id];
        dispatch(ADDTOCART(updatedCartlist));
        localStorage.setItem("addProduct", JSON.stringify(updatedCartlist));
      })
      .catch((error) => {
        return "There was an error!", error;
      });
    toast.success("Successfully Added to Cart!!");
  };
  useEffect(() => {}, [dispatch]);
  return (
    <>
      {btn ? (
        <Btn attrBtn={{ className: customeclass, onClick: AddtoCart }}>{Addtocart}</Btn>
      ) : (
        <a className={customeclass} onClick={AddtoCart}>
          {Addtocart}
        </a>
      )}
    </>
  );
};

export default AddtoCartBtn;

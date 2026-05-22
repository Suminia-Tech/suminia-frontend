import { ADDTOCART, QUANTITY } from "@/ReduxToolkit/Reducers/AddtoCartReducer";
import { ISCARTADD } from "@/ReduxToolkit/Reducers/ModalReducer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShoppingBag } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddToCartProduct = ({ elem, staticActions }) => {
  const { addToCartModal } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const addProduct = useSelector((state) => state.AddToCartReducer.product);
  const AddtoCart = () => {
    if (staticActions) {
      router.push("/page/cart");
    } else {
      dispatch(ISCARTADD(!addToCartModal, elem));
      axios
        .post("/api/addtocart", { id: elem?.id })
        .then((res) => {
            const updatedCartlist = [...addProduct, elem?.id];
          dispatch(ADDTOCART(updatedCartlist));         
          localStorage.setItem("addProduct", JSON.stringify(updatedCartlist));
        })
        .catch((error) => {
          return "There was an error!", error;
        });
      toast.success("Successfully Added to Cart!!");
    }
  };
  useEffect(() => {}, [dispatch]);
  return (
    <>
      <li onClick={AddtoCart}>
        <a href="#javascript" className="addtocart-btn">
          <ShoppingBag />
        </a>
      </li>
    </>
  );
};

export default AddToCartProduct;

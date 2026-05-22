import { wishlist } from "@/Constant";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { PostCartData } from "@/Utils";
import { ADDTOWISHLIST } from "@/ReduxToolkit/Reducers/AddtoCartReducer";
import { NOTIFICATIONALTER } from "@/ReduxToolkit/Reducers/ModalReducer";

const ProductWishListAction = ({ singleProduct }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const AddtoWishList = () => {
    PostCartData(`/api/addtowishlist`, { id: singleProduct ? singleProduct[0]?.id : 1 })
      .then((res) => {
        dispatch(ADDTOWISHLIST(res?.data));
      })
      .catch((error) => {
        return "There was an error!", error;
      });
    dispatch(NOTIFICATIONALTER(singleProduct, true));
    router.push("/page/wishlist");
  };
  useEffect(() => {}, [dispatch]);
  return (
    <a className="btn btn-solid" onClick={AddtoWishList}>
      <i className="fa fa-bookmark fz-16 me-2"></i>
      <span>{wishlist}</span>
    </a>
  );
};

export default ProductWishListAction;

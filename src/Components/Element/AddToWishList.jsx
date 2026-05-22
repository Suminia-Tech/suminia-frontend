import { useRouter } from "next/navigation";
import { Heart } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { PostCartData } from "@/Utils";
import { ADDTOWISHLIST } from "@/ReduxToolkit/Reducers/AddtoCartReducer";

const AddToWishList = ({ elem, staticActions }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const wishlist = useSelector((state) => state.AddToCartReducer.wishlist);

  const AddtoWishList = () => {
    if (staticActions) {
      router.push("/page/wishlist");
    } else {
      PostCartData(`/api/addtowishlist`, { id: elem?.id })
        .then((res) => {
          const updatedWishlist = [...wishlist, elem?.id];
          dispatch(ADDTOWISHLIST(updatedWishlist));
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          router.push(`/page/wishlist`);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };

  return (
    <li onClick={() => AddtoWishList()}>
      <a href="#javascript" className="wishlist">
        <Heart />
      </a>
    </li>
  );
};

export default AddToWishList;

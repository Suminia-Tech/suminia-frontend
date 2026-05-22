import { Account, Cart, Category, Homes, wishlist } from "@/Constant";
import { CATEGORYRESPONSIVE, OVERLAY } from "@/ReduxToolkit/Reducers/ModalReducer";
import Link from "next/link";
import { AlignJustify, Heart, Home, ShoppingBag, User } from "react-feather";
import { useDispatch } from "react-redux";

const CommonMobileView = () => {
  const dispatch = useDispatch();
  const toggleModal = () => {
    dispatch(OVERLAY());
    dispatch(CATEGORYRESPONSIVE());
  };
  return (
    <div className="mobile-menu d-sm-none">
      <ul>
        <li>
          <Link href={"/"}>
            <Home />
            <span>{Homes}</span>
          </Link>
        </li>
        <li onClick={() => toggleModal()} className="toggle-category">
          <a href="#javascript">
            <AlignJustify />
            <span>{Category}</span>
          </a>
        </li>
        <li>
          <Link href="/page/cart">
            <ShoppingBag />
            <span>{Cart}</span>
          </Link>
        </li>
        <li>
          <Link href="/page/wishlist">
            <Heart />
            <span>{wishlist}</span>
          </Link>
        </li>
        <li>
          <Link href="/page/user_dashboard">
            <User />
            <span>{Account}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CommonMobileView;

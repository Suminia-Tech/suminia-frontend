import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Color, CommonPath, ContinueShopping, Qty, SuccessAddtocart, TOTAL, VIEWCART } from "@/Constant";
import RelatedCartProduct from "../../Components/Element/RelatedCart";
import { Btn } from "@/Components/AbstractElements";
import Img from "./Images";
import { ISCARTADD } from "@/ReduxToolkit/Reducers/ModalReducer";

const CartSuccessModal = () => {
  const dispatch = useDispatch();
  const { addToCartModal, addedCartData } = useSelector((state) => state.ModalReducer);
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const toggle = () => {
    dispatch(ISCARTADD());
  };
  return (
    <Modal className="cart-modal modal-dialog-scrollable" fade centered={true} size="lg" isOpen={addToCartModal} toggle={toggle} style={{ display: `${!addToCartModal ? "none" : "block"}` }}>
      <ModalHeader toggle={toggle}>
        <Btn attrBtn={{ type: "button", className: "btn-close", onClick: () => toggle() }}></Btn>
      </ModalHeader>
      <ModalBody>
        <div className="modal-contain">
          <div>
            <div className="modal-messages">
              <i className="fas fa-check"></i> {addedCartData?.name} {SuccessAddtocart}
            </div>
            <div className="modal-product">
              <div className="modal-contain-img">
                {addedCartData?.images &&
                  addedCartData?.images.slice(0, 1).map((elem, i) => {
                    return <Img src={`${CommonPath}/${elem.src}`} className="img-fluid" alt="product" key={i} />;
                  })}
              </div>
              <div className="modal-contain-details">
                <h4>{addedCartData?.name ? addedCartData?.name : "Premier Cropped Skinny Jean"}</h4>
                <p className="font-light my-2">
                  {Color} : {addedCartData?.colors && addedCartData?.colors[0]?.toUpperCase()} , {Qty} : 1
                </p>
                <div className="product-total">
                  <h5>
                    {TOTAL} : {symbol}
                    <span>{addedCartData?.price ? (addedCartData?.price * currencyValue).toFixed(2) : "$1,140.00"}</span>
                  </h5>
                </div>
                <div className="shop-cart-button mt-3">
                  <Link href={"/shop/shop_left_sidebar"} className="btn default-light-theme conti-button default-theme default-theme-2 rounded" onClick={() => toggle()}>
                    {ContinueShopping}
                  </Link>
                  <Link href={"/page/cart"} className="btn default-light-theme conti-button default-theme default-theme-2 rounded" onClick={() => toggle()}>
                    {VIEWCART}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <RelatedCartProduct addedCartData={addedCartData} />
        </div>
      </ModalBody>
    </Modal>
  );
};
export default CartSuccessModal;

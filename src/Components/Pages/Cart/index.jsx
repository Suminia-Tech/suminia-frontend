import Img from "@/Components/Element/Images";
import { ContinueShopping, clearallitems } from "@/Constant";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { deleteProduct } from "../../../Utils";
import { Btn } from "../../AbstractElements";
import BottomContain from "./BottomContain";
import CartData from "./CartData";
import CounterCart from "./CounterCart";
import { ADDTOCART } from "@/ReduxToolkit/Reducers/AddtoCartReducer";

const ProductCart = () => {
  const [totalMrp, setTotalMrp] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [loading,setLoading]=useState(false)
  const dispatch = useDispatch();
  const router = useRouter();
  const { product } = useSelector((state) => state.AddToCartReducer);
  useEffect(() => {
    const cartProductIds = JSON.parse(localStorage.getItem("addProduct")) || [];
    if (cartProductIds.length > 0){
      setLoading(true);
        axios
          .get(`/api/getcart?addProduct=${JSON.stringify(cartProductIds)}`)
          .then((res) => {
            setCartData(res.data);
          })
          .catch((error) => {
            return error;
          })
          .finally(() => {
            setLoading(false);
          });
    }
    else{
      setCartData([])
    }
  }, [product]);
 
  const removeAll = () => {
    deleteProduct(`/api/remove/cart/all`).then((res) => {
      if(res?.data){
        dispatch(ADDTOCART([]));
        localStorage.setItem("addProduct", JSON.stringify([]));
        setCartData([]);
      }
    });
  };

  const RedirectTo = (e) => {
    e.preventDefault();
    router.push("/shop/shop_left_sidebar");
  };
  return (
    <section className="cart-section section-b-space">
      <Container>
        <Row className="justify-content-center">
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              {cartData.length > 0 ? (
                <>
                  <CounterCart />
                  <CartData cartData={cartData} setTotalMrp={setTotalMrp} />
                  <Col xs="12" className="mt-md-5 mt-4">
                    <Row>
                      <Col sm="7" xs="5" className="order-1">
                        <div className="left-side-button text-end d-flex d-block justify-content-end">
                          <button className="text-decoration-underline theme-color btn d-block text-capitalize" onClick={() => removeAll()}>
                            {clearallitems}
                          </button>
                        </div>
                      </Col>
                      <Col sm="5" xs="7">
                        <div className="left-side-button float-start">
                          <Link href={`/layout/fashion`} className="btn btn-solid-default btn fw-bold mb-0 ms-0">
                            <i className="fas fa-arrow-left"></i> {ContinueShopping}
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <BottomContain cartData={cartData} totalMrp={totalMrp} />
                </>
              ) : (
                <Col xs="12">
                  <div className="empty-box text-center">
                    <Img src="/assets/images/cartEmpty.png" className="img-fluid mb-sm-4 mb-3" alt="empty cart" />
                    <div className="w-100">
                      <h5 className="mb-3 font-dark">{`Your shopping cart is empty. Let's add something to it`}</h5>
                      <Btn attrBtn={{ className: "btn-solid-default", onClick: (e) => RedirectTo(e) }}>{ContinueShopping}</Btn>
                    </div>
                  </div>
                </Col>
              )}
            </>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default ProductCart;

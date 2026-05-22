/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Col, Table } from "reactstrap";
import { action, CommonPath, image, Prices, productname, quentityname, Total } from "@/Constant";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import { deleteProduct } from "../../../Utils";
import MobileViewCartData from "./MobileViewCartData";
import Img from "@/Components/Element/Images";
import { ADDTOCART, QUANTITY } from "@/ReduxToolkit/Reducers/AddtoCartReducer";

const CartData = ({ cartData, setTotalMrp }) => {
  const { quantity } = useSelector((state) => state.AddToCartReducer);
  const dispatch = useDispatch();
   const handleQtyChange = (qty, id, price) => {
     dispatch(QUANTITY({ qty, id, price }));
   };

  useEffect(() => {
    setTotalMrp(() => {
      let total = 0;
      Object.keys(quantity).forEach((item) => {
        total += quantity[item].qty * quantity[item].price;
      });
      return total;
    });
  }, [quantity]);

  const removeProduct = (product) => {
    deleteProduct(`/api/remove/cart/${product.id}`).then((res) => {
      dispatch(ADDTOCART(res?.data));
      let addCartProducts = JSON.parse(localStorage.getItem("addProduct")) || [];
      addCartProducts = addCartProducts.filter((index) => index !== product.id);
      localStorage.setItem("addProduct", JSON.stringify(addCartProducts));      
    });
  };

  return (
    <Col sm="12" className="table-responsive mt-4">
      <Table className="cart-table">
        <thead>
          <tr className="table-head">
            <th scope="col">{image}</th>
            <th scope="col">{productname}</th>
            <th scope="col">{Prices}</th>
            <th scope="col">{quentityname}</th>
            <th scope="col">{action}</th>
            <th scope="col">{Total}</th>
          </tr>
        </thead>
        <tbody>
          {cartData &&
            cartData.map((elem, i) => {
              return (
                <tr key={elem.id}>
                  <td>
                    <a>
                      {elem?.images?.slice(0, 1).map((item, i) => {
                        return <Img src={`${CommonPath}/${item.src}`} key={i} alt="cart" />;
                      })}
                    </a>
                  </td>
                  <MobileViewCartData elem={elem} handleQtyChange={handleQtyChange} removeProduct={removeProduct} quantity={quantity} />
                  <td>
                    <h2>${elem.price}</h2>
                  </td>
                  <td>
                    <div className="qty-box">
                      <div className="input-group">
                        <Input type="number" name="quantity" value={quantity[elem.id]?.qty ? quantity[elem.id]?.qty : 1} min={1} className="form-control input-number" onChange={(e) => handleQtyChange(e.target.value, elem.id, elem.price)} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href="#javascript" onClick={() => removeProduct(elem)}>
                      <i className="fas fa-times"></i>
                    </a>
                  </td>
                  <td>
                    <h2 className="td-color">${quantity[elem.id]?.qty && quantity[elem.id]?.qty ? elem?.price * quantity[elem.id]?.qty : elem.price}</h2>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Col>
  );
};

export default CartData;

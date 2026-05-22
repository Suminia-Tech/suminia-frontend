import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { deleteProduct } from "../../../Utils";
import { CommonPath } from "@/Constant";
import MobileViewData from "./MobileViewData";
import WishlistTableHead from "./WishlistTableHead";
import Img from "@/Components/Element/Images";
import { ADDTOWISHLIST } from "@/ReduxToolkit/Reducers/AddtoCartReducer";

const WishlistDataList = ({ wishlistData }) => {
  const dispatch = useDispatch();
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);

  const removeProduct = (product) => {
    deleteProduct(`/api/remove/wishlist/${product.id}`).then((res) => {
      if (res?.data) {
        dispatch(ADDTOWISHLIST(res?.data));
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist = wishlist.filter((id) => id !== product.id); 
        localStorage.setItem("wishlist", JSON.stringify(wishlist)); 
      }
    });
  };

  return (
    <Table className="cart-table wishlist-table">
      <WishlistTableHead />
      <tbody>
        {wishlistData &&
          wishlistData.map((elem) => {
            return (
              <tr key={elem.id}>
                <td>
                  <Link href={`/product/product_left_sidebar/${elem.id}`}>
                    {elem?.images?.slice(0, 1).map((item, i) => (
                      <Img src={`${CommonPath}/${item.src}`} alt="product" key={i} />
                    ))}
                  </Link>
                </td>
                <MobileViewData elem={elem} />
                <td>
                  <p className="fw-bold">{`${symbol}${(elem.price * currencyValue).toFixed(2)}`}</p>
                </td>
                <td>
                  <p>{elem.inStock > 0 ? "In Stock" : "Out of Stock"}</p>
                </td>
                <td>
                  <button className="icon btn" onClick={() => removeProduct(elem)}>
                    <i className="fas fa-times"></i>
                  </button>
                  <Link href={`/page/cart`} className="icon">
                    <i className="fas fa-shopping-cart"></i>
                  </Link>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default WishlistDataList;

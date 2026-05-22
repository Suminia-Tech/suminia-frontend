import Img from "@/Components/Element/Images";
import MobileViewData from "@/Components/Pages/WishList/MobileViewData";
import WishlistDataList from "@/Components/Pages/WishList/WishlistDataList";
import WishlistTableHead from "@/Components/Pages/WishList/WishlistTableHead";
import { action, availability, CommonPath, image, price, ProductName } from "@/Constant";
import { getAPIData } from "@/Utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Settings } from "react-feather";
import { useSelector } from "react-redux";
import { Col, Table } from "reactstrap";

const WishList = ({ icon }) => {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { wishlist } = useSelector((state) => state.AddToCartReducer);
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);

  useEffect(() => {
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlistIds.length > 0) {
      setLoading(true);
      getAPIData(`/api/getwishlist?wishlist=${JSON.stringify(wishlistIds)}`)
        .then((res) => {
          setWishlistData(res.data);
        })
        .catch((error) => {
          console.error("Error fetching wishlist data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setWishlistData([]);
    }
  }, [wishlist]);

  return (
    <li className="onhover-dropdown wislist-dropdown">
      <div className="cart-media">
        <div className="cart-icon">{icon ? <Settings /> : <Heart />}</div>
      </div>
      <div className="onhover-div">
        {loading ? (
          <>Loading...</>
        ) : (
          <>
            {wishlistData.length > 0 ? (
              <Col sm="12" className="table-responsive">
                <Table className="cart-table wishlist-table">
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
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Col>
            ) : (
              <div className="wislist-empty">
                <i className="fab fa-gratipay"></i>
                <h6 className="mb-1">Your wislist empty !!</h6>
                <p className="font-light mb-0">explore more and shortlist items.</p>
              </div>
            )}
          </>
        )}
      </div>
    </li>
  );
};
export default WishList;

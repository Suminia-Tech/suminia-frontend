import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CommonPath } from "@/Constant";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import AddtoCartBtn from "../../Element/AddtoCartBtn";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import Img from "../../Element/Images";
import ModelViewProduct from "../../Element/ModelViewProduct";
import SkeletonLoader from "../../Element/SkeletonLoader";

const AllProductInfinite = ({ productData, num }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const { initialGrid } = useSelector((state) => state.AllGridReducer);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  return (
    <div className={`row g-sm-4 g-3 gx-sm-4 gx-3 mt-1 row-cols-2 custom-gy-5 product-style-2 ratio_asos product-list-section ${initialGrid}`}>
      {productData &&
        productData.slice(0, num).map((elem) => {
          return (
            <Fragment key={elem.id}>
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <>
                  {elem.category !== "vr" && (
                    <div>
                      <div className="product-box">
                        <div className="img-wrapper">
                          {elem.images.slice(0, 2).map((image, i) => {
                            return (
                              <div className={`${image.class}`} key={i}>
                                <a>
                                  <Img src={`${CommonPath}/${image.src}`} className="bg-img" alt="shop" />
                                </a>
                              </div>
                            );
                          })}
                          <div className="cart-wrap">
                            <ul>
                              <AddToCartProduct elem={elem} />
                              <ModelViewProduct elem={elem} />
                              <CompareProducts elem={elem} />
                              <AddToWishList elem={elem} />
                            </ul>
                          </div>
                        </div>
                        <div className="product-details">
                          <div className="rating-details">
                            <span className="font-light grid-content">{elem?.category !== "none" ? elem?.category : elem?.type}</span>
                            <DynamicRating customeclass={"mt-0"} data={elem.ratingStars} />
                          </div>
                          <div className="main-price">
                            <Link href={`/product/product_left_sidebar/${elem.id}`} className="font-default">
                              <h5 className="ms-0">{elem.name}</h5>
                            </Link>
                            <div className="listing-content">
                              <span className="font-light">{elem.size}</span>
                              <p className="font-light">{elem.description}</p>
                            </div>
                            <h3 className="theme-color">
                              {symbol}
                              {(elem.price * currencyValue).toFixed(2)}
                            </h3>
                            <AddtoCartBtn customeclass={"listing-content"} btn={true} data={elem} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Fragment>
          );
        })}
    </div>
  );
};
export default AllProductInfinite;

import { CommonPath } from "@/Constant";
import { NewArrivalSlider } from "@/Data/SliderSettingsData";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import Img from "../../Element/Images";
import ModelViewProduct from "../../Element/ModelViewProduct";
import SkeletonLoader from "../../Element/SkeletonLoader";

const ArrivalCards = ({ productData }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const ArrivalProduct = productData?.filter((el) => el.type === "fashion");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);
  return (
    <div className="product-wrapper product-style-2 slide-4 p-0 light-arrow bottom-space">
      <Slider {...NewArrivalSlider}>
        {ArrivalProduct?.slice(0, 5).map((elem, i) => {
          return (
            <Fragment key={i}>
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div>
                  <div className="product-box">
                    <div className="img-wrapper">
                      {elem.images.slice(0, 2).map((item, i) => {
                        return (
                          <div className={item.class} key={i}>
                            <Img src={`${CommonPath}/${item.src}`} className="bg-img" alt="img-wrapper" />
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
                        <span className="font-light grid-content">{elem.category}</span>
                      </div>
                      <div className="main-price">
                        <Link href={`/product/product_left_sidebar/${elem.id}`} className="font-default">
                          <h5>{elem.name}</h5>
                        </Link>
                        <h3 className="theme-color">
                          {symbol} {(elem.price * currencyValue).toFixed(2)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </Slider>
    </div>
  );
};

export default ArrivalCards;

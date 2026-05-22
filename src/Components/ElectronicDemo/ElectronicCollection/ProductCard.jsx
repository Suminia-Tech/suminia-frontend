import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { ElectronicProductSlider } from "../../../Data/SliderSettingsData";
import { CommonPath, NEW, OFF } from "@/Constant";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import Img from "../../Element/Images";
import ModelViewProduct from "../../Element/ModelViewProduct";
import SkeletonLoader from "../../Element/SkeletonLoader";

const ProductCard = ({ ProductFilter }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <div className="product-wrapper slide-6">
      <Slider {...ElectronicProductSlider}>
        {ProductFilter?.slice(0, 7).map((elem, i) => {
          return (
            <Fragment key={i}>
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div>
                  <div className="product-box">
                    <div className="img-wrapper">
                      <Link href={`/product/product_left_sidebar/${elem.id}`}>
                        {elem.images.map((item) => {
                          return <Img src={`${CommonPath}/${item.src}`} className="bg-img" alt="blog_category" key={i} />;
                        })}
                      </Link>
                      {elem.discount > 0 && (
                        <div className="label-block">
                          <span className="label label-black">{NEW}</span>
                          <span className="label label-theme">
                            {elem.discount}% {OFF}
                          </span>
                        </div>
                      )}
                      <div className="cart-wrap">
                        <ul>
                          <AddToCartProduct elem={elem} />
                          <ModelViewProduct elem={elem} />
                          <CompareProducts elem={elem} />
                          <AddToWishList elem={elem} />
                        </ul>
                      </div>
                    </div>
                    <div className="product-details text-center">
                      <h3 className="theme-color fw-6-1">
                        {symbol}
                        {(elem.price * currencyValue).toFixed(2)}
                        <span className="font-light ml-1">
                          {symbol}
                          {(elem.mrp * currencyValue).toFixed(2)}
                        </span>
                      </h3>
                      <Link href={`/product/product_left_sidebar/${elem.id}`} className="font-default fw-6-1">
                        <h5>{elem.name}</h5>
                      </Link>
                      <DynamicRating data={elem.ratingStars} />
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

export default ProductCard;

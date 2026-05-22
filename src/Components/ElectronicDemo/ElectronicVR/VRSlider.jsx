import Link from "next/link";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { VRSlider } from "../../../Data/SliderSettingsData";
import { CommonPath } from "@/Constant";
import DynamicRating from "../../Element/DynamicRating";
import Img from "@/Components/Element/Images";

const VRSliders = ({ FilterVrProduct }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <div className="product-wrapper slide-7 product-style-1">
      <Slider {...VRSlider}>
        {FilterVrProduct.slice(7, 15).map((elem, i) => {
          return (
            <Fragment key={i}>
              {elem.category === "vr" && (
                <div>
                  <div className="product-box">
                    <div className="img-wrapper">
                      <div className="top-wishlist">
                        {elem.discount > 0 && <span className="font-dark-30">{elem.discount}%</span>}
                        <Link href={"/page/wishlist"} className="heart-wishlist wishlist">
                          <i className="far fa-heart"></i>
                        </Link>
                      </div>
                      <Link href={"/product/product_left_sidebar/35"} className="text-center">
                        {elem.images.map((item, i) => {
                          return <Img src={`${CommonPath}/${item.src}`} className="img-fluid" alt="product" key={i} />;
                        })}
                      </Link>
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
                      <a href="#javascript" className="font-default">
                        <h5>{elem.name}</h5>
                      </a>
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

export default VRSliders;

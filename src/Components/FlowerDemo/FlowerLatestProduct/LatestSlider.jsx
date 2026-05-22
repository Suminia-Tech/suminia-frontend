import Link from "next/link";
import Slider from "react-slick";
import { CommonPath, NEW, OFF } from "@/Constant";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import ModelViewProduct from "../../Element/ModelViewProduct";
import { FlowerLatestSlider } from "@/Data/SliderSettingsData";
import Img from "@/Components/Element/Images";

const LatestSlider = ({ productData }) => {
  const LatestData = productData.filter((el) => el.type === "flower");
  return (
    <div className="product-wrapper slide-5_1">
      <Slider {...FlowerLatestSlider}>
        {LatestData.map((elem, i) => {
          return (
            <div key={i}>
              <div className="product-box">
                <div className="img-wrapper">
                  <Link href={`/product/product_left_sidebar/${elem.id}`}>
                    {elem.images.map((el, i) => {
                      return <Img src={`${CommonPath}/${el.src}`} className="img-fluid bg-img" alt="furniture" key={i} />;
                    })}
                  </Link>
                  <div className="label-block">
                    <span className="label label-black">{NEW}</span>
                    <span className="label label-theme">
                      {elem.discount}% {OFF}
                    </span>
                  </div>
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
                  {elem.price !== 0 && (
                    <h3 className="theme-color">
                      ${elem.price}.00
                      <span className="font-light ml-1"> ${elem.mrp}.00</span>
                    </h3>
                  )}
                  <Link href={`/product/product_left_sidebar/${elem.id}`} className="font-default">
                    <h5>{elem.name}</h5>
                  </Link>
                  <DynamicRating data={elem.ratingStars} />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default LatestSlider;

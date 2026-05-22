import { CommonPath, NEW, OFF } from "@/Constant";
import Link from "next/link";
import Slider from "react-slick";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import Img from "../../Element/Images";
import ModelViewProduct from "../../Element/ModelViewProduct";
import { FlowerOurSlider } from "@/Data/SliderSettingsData";

const FlowerProductRight = ({ productData }) => {
  const FlowerData = productData.filter((el) => el.type === "flower");
  return (
    <div className="product-wrapper slide-three ratio_asos">
      <Slider {...FlowerOurSlider}>
        {FlowerData.map((elem, i) => {
          return (
            <div key={i}>
              <div className="product-box">
                <div className="img-wrapper">
                  <Link href="#Javascript" className="bg-size">
                    {elem.images.map((el, id) => {
                      return <Img key={id} src={`${CommonPath}/${el.src}`} alt="box" className="bg-img" />;
                    })}
                  </Link>
                  <div className="label-block">
                    <span className="label label-black">{NEW}</span>
                    {elem?.discount && (
                      <span className="label label-theme">
                        {elem.discount}% {OFF}
                      </span>
                    )}
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
                  <h3 className="theme-color">
                    ${elem.price}.00
                    <span className="font-light ml-1">${elem.mrp}.00</span>
                  </h3>
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

export default FlowerProductRight;

import Link from "next/link";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { ShoesNewSlider } from "../../../Data/SliderSettingsData";
import { CommonPath } from "@/Constant";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import ModelViewProduct from "../../Element/ModelViewProduct";
import Img from "@/Components/Element/Images";

const ShoesSliderCard = ({ SliderFilter }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <div className="product-wrapper slide-5 light-arrow bottom-space">
      <Slider {...ShoesNewSlider}>
        {SliderFilter.map((elem, i) => {
          return (
            <div key={i}>
              <div className="product-box">
                <div className="img-wrapper">
                  <a>
                    {elem.images.map((item, i) => {
                      return <Img src={`${CommonPath}/${item.src}`} className="img-fluid bg-img" alt="shoes" key={i} />;
                    })}
                  </a>
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
                    {symbol}
                    {(elem.price * currencyValue).toFixed(2)}
                    <span className="font-light ml-1">
                      {symbol}
                      {(elem.mrp * currencyValue).toFixed(2)}
                    </span>
                  </h3>
                  <Link href={`/product/product_left_sidebar/${elem.id}`} className="font-default">
                    <h5>{elem.name}</h5>
                  </Link>
                  <DynamicRating data={elem.ratingStars} customeclass={"mt-1"} />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default ShoesSliderCard;

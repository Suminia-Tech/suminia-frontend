import Link from "next/link";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { ShoesProductSlider } from "../../../Data/SliderSettingsData";
import { CommonPath, NEW, OFF } from "@/Constant";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import ModelViewProduct from "../../Element/ModelViewProduct";
import Img from "@/Components/Element/Images";

const SliderProductCard = ({ ShoesFilterProduct }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <div className="product-wrapper slide-6">
      <Slider {...ShoesProductSlider}>
        {ShoesFilterProduct.map((elem, i) => {
          return (
            <div key={i}>
              <div className="product-box">
                <div className="img-wrapper">
                  <Link href={`/product/product_left_sidebar/${elem.id}`}>
                    {elem.images.map((item, i) => {
                      return <Img src={`${CommonPath}/${item.src}`} className="bg-img img-fluid" alt="shoes" key={i} />;
                    })}
                  </Link>
                  <div className="label-block">
                    {elem.new && <span className="label label-black">{NEW}</span>}
                    {elem.discount > 0 && (
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

export default SliderProductCard;

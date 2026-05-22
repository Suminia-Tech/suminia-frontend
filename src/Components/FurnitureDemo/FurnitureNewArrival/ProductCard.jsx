import Link from "next/link";
import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import { CommonPath, OFF } from "@/Constant";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import Img from "../../Element/Images";
import ModelViewProduct from "../../Element/ModelViewProduct";

const ProductCard = ({ productData }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const ProductFilter = productData.filter((el) => el.type === "furniture");
  return (
    <>
      {ProductFilter.map((elem, i) => {
        return (
          <Col lg="4" xl="3" xs="6" key={i}>
            <div className="product-box">
              <div className="img-wrapper">
                <a className="bg-size">
                  {elem.images.map((item, i) => {
                    return <Img key={i} src={`${CommonPath}/${item.src}`} alt="furniture" className="bg-img" />;
                  })}
                </a>
                <div className="circle-shape"></div>
                <span className="background-text">{elem.type}</span>
                {elem.discount > 0 ? (
                  <div className="label-block">
                    <span className="label label-theme">
                      {elem.discount}% {OFF}
                    </span>
                  </div>
                ) : (
                  ""
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
              <div className="product-style-3 product-style-chair">
                <div className="product-title d-block mb-0">
                  <p className="font-light mb-sm-2 mb-0">{elem.feature}</p>
                  <Link href={`/product/product_left_sidebar/${elem.id}`} className="font-default">
                    <h5>{elem.name}</h5>
                  </Link>
                </div>
                <div className="main-price">
                  <DynamicRating data={elem.ratingStars} customeclass={"mb-1 mt-0"} />
                  <h3 className="theme-color">
                    {symbol}
                    {(elem.price * currencyValue).toFixed(2)}
                  </h3>
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default ProductCard;

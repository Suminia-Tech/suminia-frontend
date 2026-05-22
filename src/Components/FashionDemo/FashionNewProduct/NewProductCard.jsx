import { Btn } from "@/Components/AbstractElements";
import Img from "@/Components/Element/Images";
import { Addtocart, CommonPath, NEW, OFF } from "@/Constant";
import Link from "next/link";
import { Col } from "reactstrap";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import DynamicRating from "../../Element/DynamicRating";
import ModelViewProduct from "../../Element/ModelViewProduct";

const NewProductCard = ({ productData }) => {
  const ProductFilter = productData?.filter((el) => el.type === "fashion");
  return (
    <>
      {ProductFilter?.map((elem, i) => {
        return (
          <Col xl="3" lg="4" xs="6" key={i}>
            <div className="product-box">
              <div className="img-wrapper">
                {elem.images.slice(0, 2).map((item, i) => {
                  return (
                    <div className={`${item.class}`} key={i}>
                      <Link href={`/product/product_left_sidebar/${elem.id}`}>
                        <Img src={`${CommonPath}/${item.src}`} className="bg-img" alt="product" />
                      </Link>
                    </div>
                  );
                })}
                <div className="label-block">
                  <span className="label label-black">{NEW}</span>
                  {elem.discount > 0 ? (
                    <span className="label label-theme">
                      {elem.discount}% {OFF}
                    </span>
                  ) : (
                    ""
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
              <div className="product-details">
                <div className="rating-details">
                  <span className="font-light grid-content">{elem.category}</span>
                  <DynamicRating data={elem.ratingStars} />
                </div>
                <div className="main-price">
                  <Link href={`/product/product_left_sidebar/${elem.id}`} className="font-default">
                    <h5>{elem.name}</h5>
                  </Link>
                  <div className="listing-content">
                    <span className="font-light">{elem.category}</span>
                    <p className="font-light">{elem.description}</p>
                  </div>
                  <h3 className="theme-color">${elem.price}.00</h3>
                  <Btn attrBtn={{ className: "btn listing-content" }}>{Addtocart}</Btn>
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default NewProductCard;

import Img from "@/Components/Element/Images";
import { CommonPath } from "@/Constant";
import Link from "next/link";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import DynamicRating from "../../Element/DynamicRating";

const RightTab = ({ elem }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <Fragment>
      {elem.childtype === "rightbanners" && (
        <Col lg="4" md="6">
          <div className="product-list">
            {elem.children.map((item, i) => {
              return (
                <div className="product-box product-box-4" key={i}>
                  <div className="img-wrapper bg-trans">
                    <Link href={"/shop/shop_left_sidebar"} className="text-center">
                      <Img src={`${CommonPath}/${item.image}`} className="img-fluid" alt="shop" />
                    </Link>
                  </div>
                  <div className="product-details">
                    <h3 className="theme-color">
                      {symbol}
                      {(item.price * currencyValue).toFixed(2)}
                      <span className="font-light">
                        {symbol}
                        {(item.mrp * currencyValue).toFixed(2)}
                      </span>
                    </h3>
                    <Link href={"/shop/shop_left_sidebar"} className="font-default">
                      <h5>{item.title}</h5>
                    </Link>
                    <DynamicRating data={item.ratingStars} customeclass={"mt-1"} />
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      )}
    </Fragment>
  );
};

export default RightTab;

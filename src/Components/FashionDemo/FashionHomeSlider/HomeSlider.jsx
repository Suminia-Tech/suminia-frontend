import Slider from "react-slick";
import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import Link from "next/link";
import { MainHomeSlider } from "../../../Data/SliderSettingsData";
import ImageContain from "./ImageContain";
import SizeProduct from "./SizeProduct";
import ColorProduct from "./ColorProduct";
import QuantityProduct from "./QuantityProduct";
import Rating from "../../Element/Rating";

const HomeSlider = ({ mainSlider }) => {
  const MainSlider = mainSlider?.filter((el) => el.type === "fashion");
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <>
      <Slider {...MainHomeSlider} waitForAnimate={true} useCSS={true} useTransform={true}>
        {MainSlider &&
          MainSlider.map((elem, i) => {
            return elem.slides.map((item) => {
              return (
                <div key={i}>
                  <div className="home-slider">
                    <Row className="home-wrap m-0">
                      <Col lg="4" className="col-xxl-3 p-0 d-lg-block d-none">
                        <div className="home-left-wrapper">
                          <div>
                            <h2>{item.title}</h2>
                            <div className="d-flex">
                              <Rating style={"p-0 me-2"} />
                              <h6 className="text-light">{`(${item.review})`} </h6>
                            </div>
                            <p>{item.contain}</p>
                            <h3>
                              {symbol}
                              {(item.price * currencyValue).toFixed(2)}
                              <span className="theme-color">
                                &nbsp;
                                {symbol}
                                {(item.mrp * currencyValue).toFixed(2)}
                              </span>
                            </h3>
                            <ul className="selection-wrap">
                              <SizeProduct item={item} />
                              <ColorProduct item={item} />
                              <QuantityProduct item={item} />
                            </ul>
                            <div className="add-btn">
                              <Link href={"/page/cart"} className="btn btn-white">
                                {item.cart}
                              </Link>
                              <Link href={"/page/wishlist"} className="btn btn-solid-default ms-2">
                                <i className="fas fa-heart"></i>
                              </Link>
                            </div>
                            <div className="share-icons">
                              <span>{item.share}</span>
                              <ul className="share-icons p-0">
                                {item.social.map((el, i) => (
                                  <li key={i}>
                                    <a target="_blank" href={el.link} rel="noreferrer">
                                      <picture>
                                        <img src={el.src} className="img-fluid" alt="social icon" />
                                      </picture>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <ImageContain item={item} />
                    </Row>
                  </div>
                </div>
              );
            });
          })}
      </Slider>
    </>
  );
};
export default HomeSlider;

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { Col, Container, Row } from "reactstrap";
import { getAPIData } from "@/Utils";
import { CommonPath } from "@/Constant";
import Img from "./Images";
import { RelativeProductSlider } from "@/Data/SliderSettingsData";

const RelatedCartProduct = ({ addedCartData }) => {
  const [productData, setProductData] = useState([]);
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);

  useEffect(() => {
    getAPIData(`/api/products`).then((res) => {
      setProductData(res?.data);
    });
  }, []);

  const filterByType = productData.filter((el) => el.type === addedCartData?.type);
  filterByType.splice(filterByType.map((object) => object.id).indexOf(addedCartData?.id), 1);
  return (
    <div className="ratio_asos mt-4">
      <Container>
        <Row className="m-0">
          <Col sm="12" className="p-0">
            <div className="product-wrapper product-style-2 slide-4 p-0 light-arrow bottom-space spacing-slider">
              <Slider {...RelativeProductSlider}>
                {filterByType &&
                  filterByType.slice(0, 4).map((elem, i) => {
                    return (
                      <div key={i}>
                        <div className="product-box">
                          <div className="img-wrapper">
                            <div className="front">
                              <Link href={`/product/product_left_sidebar/${elem.id}`}>
                                <Img src={`${CommonPath}/${elem?.images[0]?.src}`} className="bg-img" alt="product-box" />
                              </Link>
                            </div>
                          </div>
                          <div className="product-details text-center">
                            <div className="rating-details d-block text-center">
                              <span className="font-light grid-content">{elem?.name}</span>
                            </div>
                            <div className="main-price mt-0 d-block text-center">
                              <h3 className="theme-color">
                                {symbol}
                                {(elem?.price * currencyValue).toFixed(2)}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RelatedCartProduct;

import Img from "@/Components/Element/Images";
import Slider from "react-slick";
import { Col, Container, Row } from "reactstrap";
import DetainTabSection from "../Common/DetailTabsection";
import ProductDetailStatic from "../Product4ImageContain/ProductDetailStatic";

const Product360ViewContain = () => {
  const setting1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const setting2 = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <section>
      <Container>
        <Row className="gx-4 gy-5">
          <Col lg="12" xs="12">
            <div className="details-items">
              <Row className="g-4">
                <Col md="6">
                  <div className="degree-section">
                    <div className="details-image ratio_asos">
                      <Slider {...setting1}>
                        <div>
                          <div className="product-image-tag">
                            <Img src="/assets/images/fashion/1.jpg" id="zoom_01" className="img-fluid w-100 image_zoom_cls-0" alt="fashion" />

                            <div className="label-tag">
                              <h6>
                                <i className="fas fa-star"></i> 4.8 <span className="font-light">120</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="product-image-tag">
                            <Img src="/assets/images/fashion/2.jpg" id="zoom_02" data-zoom-image="assets/images/fashion/2.jpg" className="img-fluid w-100 image_zoom_cls-1" alt="fashion" />

                            <div className="label-tag">
                              <h6>
                                <i className="fas fa-star"></i> 4.8 <span className="font-light">120</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="product-image-tag">
                            <Img src="/assets/images/fashion/3.jpg" id="zoom_03" data-zoom-image="assets/images/fashion/3.jpg" className="img-fluid w-100 image_zoom_cls-2" alt="fashion" />

                            <div className="label-tag">
                              <h6>
                                <i className="fas fa-star"></i> 4.8 <span className="font-light">120</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="product-image-tag">
                            <Img src="/assets/images/fashion/4.jpg" id="zoom_04" data-zoom-image="assets/images/fashion/4.jpg" className="img-fluid w-100 image_zoom_cls-3" alt="fashion" />

                            <div className="label-tag">
                              <h6>
                                <i className="fas fa-star"></i> 4.8 <span className="font-light">120</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </Slider>
                    </div>

                    <div className=" image-360" data-bs-toggle="modal" data-bs-target="#product-modal">
                      <Img src="/assets/images/360-icon.png" alt="fashion" className="img-fluid" />
                    </div>
                    <div className="details-image-option black-slide mt-4 rounded overflow-hidden">
                      <Slider {...setting2}>
                        <div>
                          <Img src="/assets/images/fashion/1.jpg" className="img-fluid" alt="fashion" />
                        </div>
                        <div>
                          <Img src="/assets/images/fashion/2.jpg" className="img-fluid" alt="fashion" />
                        </div>
                        <div>
                          <Img src="/assets/images/fashion/3.jpg" className="img-fluid" alt="fashion" />
                        </div>
                        <div>
                          <Img src="/assets/images/fashion/4.jpg" className="img-fluid" alt="fashion" />
                        </div>
                      </Slider>
                    </div>
                  </div>
                </Col>

                <Col md="6">
                  <ProductDetailStatic />
                </Col>
              </Row>
            </div>
          </Col>
          <DetainTabSection />
        </Row>
      </Container>
    </section>
  );
};
export default Product360ViewContain;

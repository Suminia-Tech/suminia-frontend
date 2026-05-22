import Img from "@/Components/Element/Images";
import { CommonPath } from "@/Constant";
import Slider from "react-slick";
import { Col, Container, Row } from "reactstrap";
import { ShopSliderContain } from "../../../../Data/ShopSlider";
import { ShopSliderData } from "../../../../Data/SliderSettingsData";

const ShopSlider = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col xs="12">
            <div className="slide-7-1 product-wrapper slick-lg-space">
              <Slider {...ShopSliderData}>
                {ShopSliderContain.map((elem, i) => {
                  return (
                    <div key={i}>
                      <div className="image-slider">
                        <div className="image-product">
                          <Img src={`${CommonPath}/${elem.image}`} className="w-100" alt="product" />
                          <div className="image-contain">
                            <h5>{elem.category}</h5>
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
    </section>
  );
};

export default ShopSlider;

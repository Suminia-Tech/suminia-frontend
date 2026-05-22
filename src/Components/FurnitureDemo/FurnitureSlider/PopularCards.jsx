import Slider from "react-slick";
import { Col } from "reactstrap";
import { FurnitureThreeSlider } from "../../../Data/SliderSettingsData";
import SliderCard from "./SliderCard";
const PopularCard = ({ popularCard }) => {
  return (
    <>
      {popularCard.map((elem, i) => {
        return (
          <Col lg="4" key={i}>
            <div className="title-3 pb-4 title-border">
              <h2>{elem.heading}</h2>
              <h5 className="theme-color">{elem.subHeading}</h5>
            </div>
            <div className="product-slider round-arrow">
              <Slider {...FurnitureThreeSlider}>
                <SliderCard elem={elem} />
                <SliderCard elem={elem} />
              </Slider>
            </div>
          </Col>
        );
      })}
    </>
  );
};
export default PopularCard;

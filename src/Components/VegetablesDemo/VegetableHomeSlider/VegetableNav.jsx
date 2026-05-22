import Img from "@/Components/Element/Images";
import Slider from "react-slick";
import { VegetableNavSlider } from "../../../Data/SliderSettingsData";
const VegetableNav = ({ nav1, slider2 }) => {
  return (
    <Slider {...VegetableNavSlider} style={{ height: 290, overflow: "hidden" }} className="slider-nav image-show slider-thumbnail" asNavFor={nav1} ref={(slider) => (slider2.current = slider)}>
      <div>
        <div className="poster-img">
          <Img src="/assets/images/vegetable/poster/t1.jpg" alt="vegetable" />
          <div className="overlay-color">
            <i className="fas fa-plus theme-color"></i>
          </div>
        </div>
      </div>
      <div>
        <div className="poster-img">
          <Img src="/assets/images/vegetable/poster/t2.jpg" alt="vegetable" />
          <div className="overlay-color">
            <i className="fas fa-plus theme-color"></i>
          </div>
        </div>
      </div>

      <div>
        <div className="poster-img">
          <Img src="/assets/images/vegetable/poster/t3.jpg" alt="vegetable" />
          <div className="overlay-color">
            <i className="fas fa-plus theme-color"></i>
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default VegetableNav;

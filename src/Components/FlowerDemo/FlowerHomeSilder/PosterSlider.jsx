/* eslint-disable @next/next/no-img-element */
import { CommonPath } from "@/Constant";
import { FlowerMainHeaderSlider } from "@/Data/SliderSettingsData";
import Slider from "react-slick";

const PosterSlider = ({ nav2, slider1, FlowerHomeSlider }) => {
  return (
    <div className="poster-image slider-for custome-arrow home-section-5">
      <Slider asNavFor={nav2} ref={(slider) => (slider1.current = slider)} {...FlowerMainHeaderSlider}>
        {FlowerHomeSlider.map((el) => {
          return el.horizontalimage.map((elem, i) => {
            return (
              <div key={i}>
                <img src={`${CommonPath}/${elem.image}`} className="img-fluid" alt="poster" />
              </div>
            );
          });
        })}
      </Slider>
    </div>
  );
};

export default PosterSlider;

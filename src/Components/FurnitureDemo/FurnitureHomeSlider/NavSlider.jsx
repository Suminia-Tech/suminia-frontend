/* eslint-disable @next/next/no-img-element */
import { CommonPath } from "@/Constant";
import Slider from "react-slick";
const NavSlider = ({ nav1, slider2, PosterFilter }) => {
  const navSlider = {
    slidesToShow: 3,
    slidesToScroll: 1,
    width: "146px",
    dots: true,
    focusOnSelect: true,
  };
  return (
    <Slider {...navSlider} style={{ height: 440 }} className="slider-nav image-show overflow-hidden" asNavFor={nav1} ref={(slider) => (slider2.current = slider)}>
      {PosterFilter?.map((el) => {
        return el.verticalimage.map((elem, i) => {
          return (
            <div key={i}>
              <div className="poster-img">
                <img src={`${CommonPath}/${elem.image}`} alt="poster" />
                <div className="overlay-color">
                  <i className="fas fa-plus theme-color"></i>
                </div>
              </div>
            </div>
          );
        });
      })}
    </Slider>
  );
};

export default NavSlider;

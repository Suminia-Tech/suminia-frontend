import Img from "@/Components/Element/Images";
import { CommonPath } from "@/Constant";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { AutoFadeSliderNavData, AutoFadeSliderPosterData } from "../../../Data/SliderSettingsData";
import { YOUTUBEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const AutoFadeSlider = ({ VideoPlay, singleProduct }) => {
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);
  const { nav1, nav2 } = state;
  return (
    <div className="degree-section">
      <div className="details-image ratio_asos">
        <Slider {...AutoFadeSliderPosterData} asNavFor={nav1} ref={(slider) => (slider2.current = slider)}>
          {singleProduct &&
            singleProduct.map((item) => {
              return item.images.map((elem) => {
                return (
                  <div key={elem.id}>
                    <div className="product-image-tag">
                      <Img src={`${CommonPath}/${elem.src}`} className="img-fluid w-100 image_zoom_cls-0" alt="tag" />
                      <div className="label-tag">
                        <h6>
                          <i className="fas fa-star"></i> {item?.ratingStars} <span className="font-light">{120}</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                );
              });
            })}
        </Slider>
      </div>
      {VideoPlay !== undefined ? (
        <div className="image-360 videoplay-box" onClick={() => dispatch(YOUTUBEMODAL())}>
          <Img src="https://img.icons8.com/ios/50/000000/circled-play.png" alt="image-360" />
        </div>
      ) : (
        ""
      )}
      <div className="details-image-option black-slide mt-4 rounded overflow-hidden">
        <Slider {...AutoFadeSliderNavData} asNavFor={nav2} ref={(slider) => (slider1.current = slider)}>
          {singleProduct &&
            singleProduct.map((item) => {
              return item.images.map((elem) => {
                return (
                  <div key={elem.id}>
                    <Img src={`${CommonPath}/${elem.src}`} className="img-fluid" alt="details" />
                  </div>
                );
              });
            })}
        </Slider>
      </div>
    </div>
  );
};

export default AutoFadeSlider;

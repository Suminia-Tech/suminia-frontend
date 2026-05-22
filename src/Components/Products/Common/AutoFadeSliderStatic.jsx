import { CommonPath } from "@/Constant";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { AutoFadeSliderImageData } from "../../../Data/ProductDetailsData";
import { AutoFadeSliderNavData, AutoFadeSliderPosterData } from "../../../Data/SliderSettingsData";
import Img from "@/Components/Element/Images";
import { YOUTUBEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const AutoFadeSliderStatic = ({ VideoPlay }) => {
  const [state, setState] = useState({ nav1: null, nav2: null });
  const dispatch = useDispatch();
  const slider1 = useRef();
  const slider2 = useRef();
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
          {AutoFadeSliderImageData.map((elem) => {
            return (
              <div key={elem.id}>
                <div className="product-image-tag">
                  <Img src={`${CommonPath}${elem.image}`} className="img-fluid w-100 image_zoom_cls-0" alt="" />
                  <div className="label-tag">
                    <h6>
                      <i className="fas fa-star"></i> {elem.ratingStars} <span className="font-light">{120}</span>
                    </h6>
                  </div>
                </div>
              </div>
            );
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
          {AutoFadeSliderImageData.map((elem) => {
            return (
              <div key={elem.id}>
                <Img src={`${CommonPath}${elem.image}`} className="img-fluid" alt="image-360" />
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default AutoFadeSliderStatic;

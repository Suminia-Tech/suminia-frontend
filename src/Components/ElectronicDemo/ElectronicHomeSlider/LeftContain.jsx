import { YOUTUBEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
import { Slide } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";

const LeftContain = ({ elem }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="offer-wrap">
        <h4 className="theme-color mb-2">{elem.left.top}</h4>
        <h6>{elem.left.topdescription}</h6>
      </div>
      <Slide direction="up" duration="2000">
        <div className="home-content">
          <h1 data-animation-in="fadeInUp">{elem.left.headingtop}</h1>
          <h1 className="mb-2" data-delay-in="0.3" data-animation-in="fadeInUp">
            {elem.left.headingbottom}
          </h1>
          <h2 className="mb-4 d-sm-block d-none" data-animation-in="fadeInUp" data-delay-in="0.4">
            {elem.left.tagline}
          </h2>
          <h3 className="mb-3" data-animation-in="fadeInUp" data-delay-in="0.5">
            <span className="theme-color">
              {symbol}
              {(elem.left.price * currencyValue).toFixed(2)}
            </span>
            <span className="text-decoration-line-through">
              {symbol}
              {(elem.left.mrp * currencyValue).toFixed(2)}
            </span>
          </h3>
          <p className="mb-0 d-sm-block d-none text-dark" data-animation-in="fadeInUp" data-delay-in="0.6">
            {elem.left.description}
          </p>
          <div className="discover-block d-sm-block d-none" data-animation-in="fadeInUp" data-delay-in="0.7">
            <div className="d-flex">
              <a href="#javascript" className="play-icon theme-bg-color" onClick={() => dispatch(YOUTUBEMODAL())}>
                <i className="fas fa-play"></i>
              </a>
              <div className="discover-content">
                <h4 className="theme-color mb-1">{elem.left.bottomheadind}</h4>
                <h6>{elem.left.bottomsubheading}</h6>
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
};

export default LeftContain;

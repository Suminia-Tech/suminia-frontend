import { useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { Slide } from "react-awesome-reveal";
import Img from "../../Element/Images";
import { YOUTUBEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const ImageContain = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <>
      <Col lg="8" className="col-xxl-9 left-content p-0">
        <Img src={`${item?.mainImg}`} className="bg-img" alt="fashion" />
        <Row className="home-content">
          <Col sm="5" md="4" lg="4" xs="6" className="col-xxl-4">
            <Slide direction="up" duration="1000">
              <h3>
                {item.Sale} <span className="theme-color">{item.offer}</span>
              </h3>
              <h1 data-animation-in="fadeInUp">{item.New}</h1>
              <h6 className="mb-4" data-animation-in="fadeInUp" data-delay-in="0.4">
                {item.buy}
                <span className="theme-color">{item.free}</span>
              </h6>
              <div className="discover-block" data-animation-in="fadeInUp" data-delay-in="0.7">
                <div className="d-flex">
                  <a href="#javascript" className="play-icon theme-bg-color" onClick={() => dispatch(YOUTUBEMODAL())}>
                    <i className="fas fa-play"></i>
                  </a>
                  <div className="discover-content">
                    <h4 className="theme-color mb-1">{item.Discover}</h4>
                    <h6>{item.Collection}</h6>
                  </div>
                </div>
              </div>
            </Slide>
          </Col>
        </Row>
      </Col>
    </>
  );
};
export default ImageContain;

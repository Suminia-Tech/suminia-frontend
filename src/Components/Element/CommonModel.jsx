import { CommonPath } from "@/Constant";
import { ProductNavModalSlider, ProductPosterModalSlider } from "@/Data/SliderSettingsData";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Img from "./Images";
import ModalProductDetails from "./ModalProductDetails";
import { IS_MODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const CommonModel = () => {
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(IS_MODAL());
  };
  const { modal, data } = useSelector((state) => state.ModalReducer);
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  const { nav1, nav2 } = state;
  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);

  return (
    <Modal size="lg" centered={true} className="quick-view-modal modal-dialog modal-dialog-scrollable" id="quick-view" isOpen={modal} toggle={toggle} style={{ display: `${!modal ? "none" : "block"}` }}>
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <Row className="gy-4">
          <Col lg="6">
            <div className="quick-view-image">
              <div className="quick-view-slider ratio_2">
                <Slider {...ProductPosterModalSlider} asNavFor={nav2} ref={(slider) => (slider1.current = slider)}>
                  {data?.images?.map((item, i) => {
                    return (
                      <div key={i} className="bg-size">
                        <Img src={`${CommonPath}/${item.src}`} className="img-fluid bg-img" alt="product" />
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <div className="quick-nav">
                <Slider {...ProductNavModalSlider} slidesToShow={data?.images?.length} asNavFor={nav1} ref={(slider) => (slider2.current = slider)}>
                  {data?.images?.map((item, i) => {
                    return (
                      <div key={i}>
                        <Img src={`${CommonPath}/${item.src}`} className="img-fluid" alt="product" />
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          </Col>
          <ModalProductDetails data={data} />
        </Row>
      </ModalBody>
    </Modal>
  );
};
export default CommonModel;

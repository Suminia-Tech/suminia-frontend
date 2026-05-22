import { YOUTUBEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const YoutubeModal = () => {
  const { youTubeModal } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(YOUTUBEMODAL());
  };
  return (
    <Modal className="video-play-modal" size="lg" centered={true} toggle={toggle} tabIndex="-1" isOpen={youTubeModal} role="dialog" aria-label="myModalLabel" aria-hidden="true">
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody className="location-map">
        <iframe src="https://www.youtube.com/embed/3xDTtv22G-s" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="" style={{ height: 550, width: "100%" }}></iframe>
      </ModalBody>
    </Modal>
  );
};

export default YoutubeModal;

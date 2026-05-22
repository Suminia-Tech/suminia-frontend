/* eslint-disable @next/next/no-img-element */
import { SIZEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const SizeModal = () => {
  const { sizeModal } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(SIZEMODAL());
  };
  return (
    <Modal fade centered={true} className="modal-size" isOpen={sizeModal} toggle={toggle}>
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <img src="/assets/images/size-chart.jpg" alt="size-chart" className="img-fluid" />
      </ModalBody>
    </Modal>
  );
};

export default SizeModal;

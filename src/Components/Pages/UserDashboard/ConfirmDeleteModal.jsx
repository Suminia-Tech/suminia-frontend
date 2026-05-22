import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DoneDeleteYourAccount, Okay } from "@/Constant";
import { Btn } from "../../AbstractElements";
import { CONFIRMDELETE } from "@/ReduxToolkit/Reducers/ModalReducer";
const ConfirmDeleteModal = () => {
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(CONFIRMDELETE());
  };
  const { ConfirmDelete } = useSelector((state) => state.ModalReducer);
  return (
    <Modal className="delete-account-modal" id="doneModal" isOpen={ConfirmDelete} toggle={toggle}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <ModalHeader toggle={toggle}></ModalHeader>
          <ModalBody className="pb-3 text-center mt-4">
            <h4>{DoneDeleteYourAccount}</h4>
          </ModalBody>
          <ModalFooter className="d-block text-center mb-4">
            <Btn attrBtn={{ className: "btn btn-solid-default btn-sm fw-bold rounded", onClick: () => toggle() }}>{Okay}</Btn>
          </ModalFooter>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmDeleteModal;

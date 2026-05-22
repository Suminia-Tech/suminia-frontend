import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Btn } from "../../AbstractElements";
import { Close, ComfirmEmailaddress, ConfirmEmail, EmailAddress, Password, Savechanges } from "@/Constant";
import { ISPROFILEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
const ProfileModal = () => {
  const dispatch = useDispatch();
  const { profileModal } = useSelector((state) => state.ModalReducer);
  const toggle = () => {
    dispatch(ISPROFILEMODAL());
  };
  return (
    <Modal className={`reset-email-modal ${profileModal ? "d-block" : "d-none"}`} isOpen={profileModal} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="modal-title" id="exampleModalLabel">
          {ConfirmEmail}
        </h3>
      </ModalHeader>
      <ModalBody className="pt-3">
        <Form>
          <div className="mb-3">
            <label for="email" className="form-label font-light">
              {EmailAddress}
            </label>
            <Input type="email" className="form-control" id="email" />
          </div>
          <div className="mb-3">
            <label for="comfirmEmail" className="form-label font-light">
              {ComfirmEmailaddress}
            </label>
            <Input type="email" className="form-control" id="comfirmEmail" />
          </div>
          <div>
            <label for="exampleInputPassword1" className="form-label font-light">
              {Password}
            </label>
            <Input type="password" className="form-control" id="exampleInputPassword1" />
          </div>
        </Form>
      </ModalBody>
      <ModalFooter className="pt-0">
        <Btn attrBtn={{ className: "btn bg-secondary rounded-1 modal-close-button", onClick: () => toggle() }}>{Close}</Btn>
        <Btn attrBtn={{ className: "btn btn-solid-default rounded-1", onClick: () => toggle() }}>{Savechanges}</Btn>
      </ModalFooter>
    </Modal>
  );
};
export default ProfileModal;

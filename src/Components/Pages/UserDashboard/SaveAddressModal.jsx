import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Btn } from "../../AbstractElements";
import { Close, FullAddress, Fullname, Mobile } from "@/Constant";
import { SAVEADDRESSMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const SaveAddressModal = () => {
  const { saveAddressModal } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(SAVEADDRESSMODAL());
  };
  return (
    <Modal className="add-address-modal" centered={true} id="addAddress" isOpen={saveAddressModal} toggle={toggle}>
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <Form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label font-light">
              {Fullname}
            </label>
            <Input type="text" className="form-control" id="name" placeholder="full name" />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label font-light">
              {FullAddress}
            </label>
            <Input type="text" className="form-control" id="address" placeholder="123, abcd, xyz" />
          </div>
          <div>
            <label htmlFor="number" className="form-label font-light">
              {Mobile}
            </label>
            <Input type="number" className="form-control" id="number" placeholder="+1-123-456-7890" />
          </div>
        </Form>
      </ModalBody>
      <ModalFooter className="pt-0 text-end d-block">
        <Btn attrBtn={{ className: "text-white rounded-1 modal-close-button", onClick: () => toggle() }}>{Close}</Btn>
        <Btn attrBtn={{ className: "btn-solid-default rounded-1", onClick: () => toggle() }}>{`Save Address`}</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default SaveAddressModal;

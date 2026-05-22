import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Btn } from "../../AbstractElements";
import { allCards, CardType, ChooseYourCard, Close, SaveCardDetails } from "@/Constant";
import { PAYMENTCARDMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const PaymentCardModal = () => {
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(PAYMENTCARDMODAL());
  };
  const { paymentCardsModal } = useSelector((state) => state.ModalReducer);
  return (
    <Modal className={`payment-modal ${paymentCardsModal ? "d-block" : "d-none"}`} centered={true} isOpen={paymentCardsModal} toggle={toggle}>
      <div className="modal-content">
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <Form>
            <label htmlFor="name" className="form-label">
              {CardType}
            </label>
            <select className="form-select form-select-lg mb-4">
              <option selected disabled>
                {ChooseYourCard}
              </option>
              {allCards.map((elem, i) => (
                <option value={elem} key={i}>
                  {elem}
                </option>
              ))}
            </select>

            <div className="mb-4">
              <Label htmlFor="card" className="form-label">
                Name On Card
              </Label>
              <Input type="text" className="form-control" id="card" placeholder="Name card" />
            </div>
            <div className="mb-4">
              <Label htmlFor="cAddress" className="form-label">
                Card Number
              </Label>
              <Input type="number" className="form-control" id="cAddress" placeholder="XXXX-XXXX-XXXX-XXXX" />
            </div>
            <div className="row">
              <div className="col-md-8 mb-4">
                <Label htmlFor="expiry" className="form-label">
                  Expiry Date
                </Label>
                <Input type="date" className="form-control font-light" id="expiry" />
              </div>
              <div className="col-md-4 mb-4">
                <Label htmlFor="cvv" className="form-label">
                  CVV
                </Label>
                <Input type="number" className="form-control" id="cvv" placeholder="XX9" />
              </div>
            </div>
          </Form>
        </ModalBody>
      </div>
      <ModalFooter className="pt-0 text-end d-block">
        <Btn attrBtn={{ className: "text-white rounded-1 modal-close-button", onClick: () => dispatch(PAYMENTCARDMODAL()) }}>{Close}</Btn>
        <Btn attrBtn={{ className: "btn btn-solid-default rounded-1", onClick: () => dispatch(PAYMENTCARDMODAL()) }}>{SaveCardDetails}</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentCardModal;

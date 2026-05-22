import { Btn } from "@/Components/AbstractElements";
import { Neverdate, Ohfree, SignNewsletter, Submit } from "@/Constant";
import { STARTMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Modal, ModalBody, ModalHeader } from "reactstrap";
const StartModel = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(STARTMODAL());
  }, [dispatch]);
  const { firstModal } = useSelector((state) => state.ModalReducer);
  const toggle = () => {
    dispatch(STARTMODAL());
  };
  return (
    <Modal className="newletter-modal" toggle={toggle} isOpen={firstModal} centered={true}>
      <div className="modal-content">
        <ModalHeader toggle={toggle}>
          <Btn
            attrBtn={{
              type: "button",
              className: "btn-close",
              onClick: () => toggle(),
            }}
          ></Btn>
        </ModalHeader>
        <ModalBody>
          <Image width={140} height={123} src="/assets/images/newletter-icon.png" className="img-fluid" alt="newletter" />
          <div className="modal-title">
            <h2 className="tt-title">{SignNewsletter}</h2>
            <p className="font-light">{Neverdate}</p>
            <p className="font-light">{Ohfree}</p>
            <div className="input-group mb-3">
              <Input placeholder="Email" className="form-control" type="text" />
            </div>
            <div className="cancel-button text-center">
              <Btn
                attrBtn={{
                  className: "default-theme w-100",
                  color: "none",
                  onClick: () => toggle(),
                }}
              >
                {Submit}
              </Btn>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};
export default StartModel;

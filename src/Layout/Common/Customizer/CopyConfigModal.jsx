import { CONFIGMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
const CopyConfigModal = () => {
  const dispatch = useDispatch();
  const { configToggle } = useSelector((state) => state.ModalReducer);
  const toggle = () => {
    dispatch(CONFIGMODAL());
  };
  const { primaryColor, direction, mode } = useSelector((state) => state.ThemeCustomizerReducer);
  const copySettingsToClipboard = () => {
    let copyJson = `{
            "layout":"${direction}",
            "primaryColor":"${primaryColor}",
            "darkMode":${mode}
          }`;
    navigator.clipboard.writeText(copyJson);
  };
  return (
    <Modal toggle={toggle} isOpen={configToggle} centered={true} className="copybox-modal">
      <div className="modal-content">
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <div>
            <div className="modal-title mb-sm-5 mb-4">
              <h2>Copy Layout Settings</h2>
            </div>
            <div className="copy-modal-content">
              <div className="copy-detail">
                <p>
                  <span>Dark Mode : &nbsp;</span> <span>{direction}</span>
                </p>
                <p>
                  <span>Layout Type : &nbsp;</span> <span>{primaryColor}</span>
                </p>
                <p>
                  <span>Layout Color : &nbsp;</span> <span>{mode}</span>
                </p>
              </div>
              <div className="mt-4" onClick={copySettingsToClipboard}>
                <a href="#javascript" className="btn copy-button default-theme rounded">
                  Copy Settings
                </a>
              </div>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};
export default CopyConfigModal;

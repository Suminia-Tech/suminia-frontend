import { PayPal, Payment } from "@/Constant";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Fragment, useEffect, useState } from "react";
import { Input, Label, Row } from "reactstrap";

const PaymantMode = ({ isFormData }) => {
  const [isRadio, setISRadio] = useState("stripe");
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }, []);
  if (show) return null;

  return (
    <Fragment>
      <h3 className="mb-3">{Payment}</h3>

      <div className="d-block my-3">
        <div className="form-check custome-radio-box">
          <Input className="form-check-input" type="radio" checked={isRadio === "stripe" ? true : false} name="flexRadioDefault" id="stripe" onChange={() => setISRadio("stripe")} />
          <Label className="form-check-label" htmlFor="stripe">
            {"Stripe"}
          </Label>
        </div>

        <div className="form-check custome-radio-box">
          <Input className="form-check-input" type="radio" name="flexRadioDefault" id="paypal" onChange={() => setISRadio("paypal")} />
          <Label className="form-check-label" htmlFor="paypal">
            {PayPal}
          </Label>
        </div>
      </div>
      <Row className="g-4">
        {isRadio === "stripe" ? (
          <h3>Stripe is comming soon!!!!</h3>
        ) : (
          <PayPalScriptProvider options={{ "client-id": "test" }}>
            <PayPalButtons style={{ layout: "horizontal" }} />
          </PayPalScriptProvider>
        )}
      </Row>
    </Fragment>
  );
};

export default PaymantMode;

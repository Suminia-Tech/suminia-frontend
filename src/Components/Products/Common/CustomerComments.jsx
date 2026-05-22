import { CommonPath, Customerreviews } from "@/Constant";
import { Col } from "reactstrap";
import { CustomerCommentsData } from "../../../Data/CustomerCommentsData";
import CommonRating from "./CommonRating";
import Img from "@/Components/Element/Images";

const CustomerComments = () => {
  return (
    <Col xs="12" className="mt-4">
      <div className="customer-review-box">
        <h4>{Customerreviews}</h4>

        {CustomerCommentsData.map((elem) => {
          return (
            <div className="customer-section" key={elem.id}>
              <div className="customer-profile">
                <Img src={`${CommonPath}${elem.img}`} className="img-fluid" alt="customer-profile" />
              </div>

              <div className="customer-details">
                <h5>{elem.name}</h5>
                <CommonRating />
                <p className="font-light">{elem.comment}</p>

                <p className="date-custo font-light">
                  {elem.date} <span></span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Col>
  );
};

export default CustomerComments;

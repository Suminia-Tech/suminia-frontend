import { Customerreviews, numRatings } from "@/Constant";
import { Col, Progress } from "reactstrap";
import { ProgressBarData } from "../../../Data/ProgressBarData";
import CommonRating from "./CommonRating";

const CustomerReview = () => {
  return (
    <Col lg="4">
      <div className="customer-rating">
        <h2>{Customerreviews}</h2>
        <CommonRating />
        <div className="global-rating">
          <h5 className="font-light">{numRatings}</h5>
        </div>
        <ul className="rating-progess">
          {ProgressBarData.map((elem) => {
            return (
              <li key={elem.id}>
                <h5 className="me-3">{elem.star}</h5>
                <Progress value={elem.value}></Progress>
                <h5 className="ms-3">{elem.value}%</h5>
              </li>
            );
          })}
        </ul>
      </div>
    </Col>
  );
};

export default CustomerReview;

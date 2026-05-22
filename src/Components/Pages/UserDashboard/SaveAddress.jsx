import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { UserDashboardData } from "../../../Data/UserDashboardData";
import { Btn } from "../../AbstractElements";
import { SAVEADDRESSMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const SaveAddress = () => {
  const ProfileFilter = UserDashboardData.filter((el) => el.type === "Saved Address");
  const dispatch = useDispatch();
  const handleModal = () => {
    dispatch(SAVEADDRESSMODAL());
  };
  return (
    <Fragment>
      {ProfileFilter.map((item, i) => {
        return (
          <Fragment key={i}>
            <div className="box-head">
              <h3>{item.head1}</h3>
              <Btn attrBtn={{ className: "btn-solid-default btn-sm fw-bold ms-auto", onClick: () => handleModal() }}>
                <i className="fas fa-plus me-1"></i>
                {item.btn}
              </Btn>
            </div>
            <div className="save-details-box">
              <Row className="g-3">
                {item.tabs.map((elem, i) => {
                  return (
                    <Col xl="4" md="6" key={i}>
                      <div className="save-details">
                        <div className="save-name">
                          <h5>{elem.name}</h5>
                          <div className="save-position">
                            <h6>{elem.head}</h6>
                          </div>
                        </div>

                        <div className="save-address">
                          <p className="font-light">{elem.add1}</p>
                          <p className="font-light">{elem.add2}</p>
                          <p className="font-light">{elem.add3}</p>
                        </div>

                        <div className="mobile">
                          <p className="font-light mobile">{elem.mobile}</p>
                        </div>

                        <div className="button">
                          <a href="#javascript" className="btn btn-sm">
                            {elem.btn1}
                          </a>
                          <a href="#javascript" className="btn btn-sm">
                            {elem.btn2}
                          </a>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default SaveAddress;

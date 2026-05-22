import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { UserDashboardData } from "../../../Data/UserDashboardData";
import LoginDetail from "./LoginDetail";
import { ISPROFILEMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const ProfileContain = () => {
  const dispatch = useDispatch();
  const ProfileFilter = UserDashboardData.filter((el) => el.type === "Profile");
  const openProfileModal = () => {
    dispatch(ISPROFILEMODAL());
  };
  return (
    <Fragment>
      {ProfileFilter.map((item, i) => {
        return (
          <Fragment key={i}>
            <div className="box-head">
              <h3>{item.type}</h3>
              <a href="#javascript" onClick={openProfileModal}>
                {item.btn}
              </a>
            </div>
            <ul className="dash-profile">
              {item.tabs.map((result) => {
                return (
                  <li key={result.id}>
                    <div className="left">
                      <h6 className="font-light">{result.ques}</h6>
                    </div>
                    <div className="right">
                      <h6>{result.answ}</h6>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="box-head mt-lg-5 mt-3">
              <h3>{item.type1}</h3>
              <a href="#javascript" onClick={openProfileModal}>
                {item.btn}
              </a>
            </div>
            <LoginDetail item={item} openProfileModal={openProfileModal} />
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default ProfileContain;

import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Nav, NavItem, NavLink } from "reactstrap";
import useWindowDimensions from "../../../Utils/useWindowDimensions";
import AllTabContain from "./AllTabContain";
import { ISDASHBOARD, OVERLAY } from "@/_template/ReduxToolkit/Reducers/ModalReducer";
import { useAuth } from "@/modules/auth";
import { ACCOUNT_TABS, ACCOUNT_TAB_ITEMS } from "./accountTabs";

const UserNav = () => {
  const [activeTab, setActiveTab] = useState(ACCOUNT_TABS.SUMMARY);
  const dispatch = useDispatch();
  const { isDashboard } = useSelector((state) => state.ModalReducer);
  const { width } = useWindowDimensions();
  const { user } = useAuth();

  const toggle = (id) => {
    width < 992 && dispatch(OVERLAY());
    setActiveTab(id);
  };

  return (
    <Fragment>
      <Col lg="3">
        <Nav className={`nav-tabs custome-nav-tabs flex-column category-option${isDashboard ? " show" : ""}`} id="myTab">
          {ACCOUNT_TAB_ITEMS.map((item) => (
            <NavItem className="mb-2" key={item.id} onClick={() => dispatch(ISDASHBOARD())}>
              <NavLink className={`${activeTab === item.id ? "active" : ""}`} onClick={() => toggle(item.id)}>
                <i className="fas fa-angle-right"></i>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Col>
      <AllTabContain activeTab={activeTab} organizationId={user?.organizationId} />
    </Fragment>
  );
};

export default UserNav;

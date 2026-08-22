import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Nav, NavItem, NavLink } from "reactstrap";
import useWindowDimensions from "../../../Utils/useWindowDimensions";
import AllTabContain from "./AllTabContain";
import { ISDASHBOARD, OVERLAY } from "@/_template/ReduxToolkit/Reducers/ModalReducer";
import { useAuth } from "@/modules/auth";
import { hasPermission } from "@/shared/lib/permissions";
import { ACCOUNT_TABS, ACCOUNT_TAB_ITEMS } from "./accountTabs";

const UserNav = () => {
  const dispatch = useDispatch();
  const { isDashboard } = useSelector((state) => state.ModalReducer);
  const { width } = useWindowDimensions();
  const { user } = useAuth();

  const items = ACCOUNT_TAB_ITEMS.filter((item) => {
    if (item.requiresOrganization && !user?.organizationId) return false;
    if (item.permission && !hasPermission(user?.permissions, item.permission)) return false;
    return true;
  });

  /* La primera visible: el personal interno de Suminia no ve las de empresa, de
     modo que fijar SUMMARY dejaria el panel en blanco para ellos. */
  const [activeTab, setActiveTab] = useState(items[0]?.id ?? ACCOUNT_TABS.PROFILE);

  const toggle = (id) => {
    width < 992 && dispatch(OVERLAY());
    setActiveTab(id);
  };

  return (
    <Fragment>
      <Col lg="3">
        <Nav className={`nav-tabs custome-nav-tabs flex-column category-option${isDashboard ? " show" : ""}`} id="myTab">
          {items.map((item) => (
            <NavItem className="mb-2" key={item.id} onClick={() => dispatch(ISDASHBOARD())}>
              <NavLink className={`${activeTab === item.id ? "active" : ""}`} onClick={() => toggle(item.id)}>
                <i className="fas fa-angle-right"></i>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Col>
      <AllTabContain activeTab={activeTab} />
    </Fragment>
  );
};

export default UserNav;

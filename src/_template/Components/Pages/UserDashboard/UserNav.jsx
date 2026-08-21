import Link from "next/link";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Nav, NavItem, NavLink } from "reactstrap";
import { UserDashboardData } from "../../../Data/UserDashboardData";
import useWindowDimensions from "../../../Utils/useWindowDimensions";
import AllTabContain from "./AllTabContain";
import { ISDASHBOARD, OVERLAY } from "@/_template/ReduxToolkit/Reducers/ModalReducer";
import { useAuth } from "@/modules/auth";

const UserNav = () => {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();
  const { isDashboard } = useSelector((state) => state.ModalReducer);
  const [num, setNum] = useState(1);
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const toggle = (id) => {
    width < 992 && dispatch(OVERLAY());
    if (activeTab !== id) {
      setActiveTab(id);
    } else {
      setActiveTab(1);
    }
    setNum(id);
  };
  return (
    <Fragment>
      <Col lg="3">
        <Nav className={`nav-tabs custome-nav-tabs flex-column category-option${isDashboard ? " show" : ""}`} id="myTab">
          {UserDashboardData.map((elem, i) => {
            return (
              <NavItem className="mb-2" key={i} onClick={() => dispatch(ISDASHBOARD())}>
                <NavLink className={`${activeTab === elem.id ? "active" : ""}`} onClick={() => toggle(elem.id, elem)}>
                  <i className="fas fa-angle-right"></i>
                  {elem.type}
                </NavLink>
              </NavItem>
            );
          })}
          {/* Pantallas reales de Suminia. A diferencia del resto del menu, que
              son pestanas de la demo, estas son rutas propias. Solo se
              muestran a quien pertenece a una empresa: el personal interno de
              Suminia no tiene organizacion. */}
          {user?.organizationId && (
            <NavItem className="mb-2">
              <NavLink tag={Link} href="/account/company">
                <i className="fas fa-angle-right"></i>
                Mi empresa
              </NavLink>
            </NavItem>
          )}
        </Nav>
      </Col>
      <AllTabContain activeTab={activeTab} num={num} />
    </Fragment>
  );
};

export default UserNav;

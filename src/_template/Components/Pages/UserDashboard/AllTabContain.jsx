import { Col, TabContent, TabPane } from "reactstrap";
import { MyProfileScreen, SecurityScreen } from "@/modules/auth";
import { MyCompanyScreen, SupplierSummaryScreen } from "@/modules/organizations";
import { MyTeamScreen } from "@/modules/users";
import MobileViewBtn from "./MobileViewBtn";
import { ACCOUNT_TABS } from "./accountTabs";

/* dashboard-profile envuelve el contenido porque las listas etiqueta/valor del
   tema (dash-profile) solo tienen estilos dentro de ese contenedor. */
const AllTabContain = ({ activeTab }) => {
  const paneClass = (id, extra = "dashboard-profile dashboard") =>
    `${activeTab === id ? "show active " : ""}${extra}`;

  return (
    <Col lg="9">
      <MobileViewBtn />
      <TabContent activeTab={activeTab}>
        <TabPane className={paneClass(ACCOUNT_TABS.SUMMARY)} tabId={ACCOUNT_TABS.SUMMARY}>
          <SupplierSummaryScreen />
        </TabPane>

        <TabPane className={paneClass(ACCOUNT_TABS.COMPANY)} tabId={ACCOUNT_TABS.COMPANY}>
          <MyCompanyScreen />
        </TabPane>

        <TabPane className={paneClass(ACCOUNT_TABS.TEAM, "table-dashboard dashboard")} tabId={ACCOUNT_TABS.TEAM}>
          <MyTeamScreen />
        </TabPane>

        <TabPane className={paneClass(ACCOUNT_TABS.PROFILE)} tabId={ACCOUNT_TABS.PROFILE}>
          <MyProfileScreen />
        </TabPane>

        <TabPane className={paneClass(ACCOUNT_TABS.SECURITY)} tabId={ACCOUNT_TABS.SECURITY}>
          <SecurityScreen />
        </TabPane>
      </TabContent>
    </Col>
  );
};

export default AllTabContain;

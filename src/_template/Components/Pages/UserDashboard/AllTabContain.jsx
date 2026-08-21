import { Col, TabContent, TabPane } from "reactstrap";
import { MyCompanyScreen, SupplierSummaryScreen } from "@/modules/organizations";
import { MyTeamScreen } from "@/modules/users";
import MobileViewBtn from "./MobileViewBtn";
import { ACCOUNT_TABS } from "./accountTabs";

/* dashboard-profile envuelve el contenido porque las listas etiqueta/valor del
   tema (dash-profile) solo tienen estilos dentro de ese contenedor. */
const AllTabContain = ({ activeTab, organizationId }) => {
  return (
    <Col lg="9">
      <MobileViewBtn />
      <TabContent activeTab={activeTab}>
        <TabPane className={`${activeTab === ACCOUNT_TABS.SUMMARY ? "show active " : ""}dashboard-profile dashboard`} tabId={ACCOUNT_TABS.SUMMARY}>
          <SupplierSummaryScreen />
        </TabPane>

        <TabPane className={`${activeTab === ACCOUNT_TABS.COMPANY ? "show active " : ""}dashboard-profile dashboard`} tabId={ACCOUNT_TABS.COMPANY}>
          <MyCompanyScreen />
        </TabPane>

        <TabPane className={`${activeTab === ACCOUNT_TABS.TEAM ? "show active " : ""}table-dashboard dashboard`} tabId={ACCOUNT_TABS.TEAM}>
          <MyTeamScreen />
        </TabPane>
      </TabContent>
    </Col>
  );
};

export default AllTabContain;

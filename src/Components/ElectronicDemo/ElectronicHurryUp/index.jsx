import { Container, Row } from "reactstrap";
import { HurryUp, SpecialOffer } from "@/Constant";
import SectionHeader from "../../Element/SectionHeader";
import TabNavBar from "./TabNavBar";
const ElectronicHurryUp = ({ tabSection }) => {
  const TabFilter = tabSection?.filter((el) => el.type === "electronic");
  return (
    <section className="tab-section">
      <Container>
        <Row>
          <div className="col">
            <SectionHeader title={SpecialOffer} subTitle={HurryUp} />
            <div className="tab-wrap">
              <TabNavBar TabFilter={TabFilter} />
            </div>
          </div>
        </Row>
      </Container>
    </section>
  );
};
export default ElectronicHurryUp;

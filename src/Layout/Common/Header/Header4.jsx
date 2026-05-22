import { Col, Row } from "reactstrap";
import { useHeaderScroll } from "@/Utils/HeaderScroll";
import AllCategories from "../../Element/AllCategories";
import HeadingLogo from "../../Element/HeadingLogo";
import NavBar from "../../Element/NavBar";
import RightHeaderDifferent from "../../Element/RightHeaderDifferent";
import SearchBarToggle from "../../Element/SearchBarToggle";
import TopHeaderBar from "../../Element/TopHeaderBar";

const Header4 = ({ noStyle, isCategories }) => {
  const UpScroll = useHeaderScroll(false);
  return (
    <header id="home" className={`custom-header ${!noStyle ? `${UpScroll ? "nav-down nav-up" : ""}` : ""}`}>
      <TopHeaderBar />
      <div className="main-header navbar-searchbar">
        <div className="container-fluid-lg">
          <Row>
            <Col lg="12">
              <div className="main-menu">
                <div className="menu-left">
                  <HeadingLogo />
                  <AllCategories isCategories={isCategories} />
                </div>
                <nav>
                  <NavBar />
                </nav>
                <RightHeaderDifferent />
                <SearchBarToggle />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};
export default Header4;

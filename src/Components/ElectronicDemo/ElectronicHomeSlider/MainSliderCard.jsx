import { CommonPath, Showdetails } from "@/Constant";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { Col, Row } from "reactstrap";
import { ElectronicMainSlider } from "../../../Data/SliderSettingsData";
import { Btn } from "../../AbstractElements";
import Img from "../../Element/Images";
import ContainCard from "./ContainCard";
import LeftContain from "./LeftContain";
import SocialTab from "./SocialTab";

const MainSliderCard = ({ ElectronicSliderFilter }) => {
  const router = useRouter();
  return (
    <Slider {...ElectronicMainSlider}>
      {ElectronicSliderFilter?.map((el) => {
        return el?.slides?.map((elem, i) => {
          return (
            <div key={i}>
              <div className="home-slider bg-size">
                <Img src={`${CommonPath}/${elem.image}`} className="bg-img" alt="home-slider" />
                <Row className="home-wrap">
                  <Col lg="4" md="6" sm="9" className="left-content">
                    <LeftContain elem={elem} />
                  </Col>
                  <Col lg="3" className="offset-lg-5 right-content d-lg-flex d-none">
                    <ContainCard elem={elem} />
                    <SocialTab elem={elem} />
                  </Col>
                </Row>
                <div className="group-btn">
                  <Btn
                    attrBtn={{
                      className: "btn-solid-default",
                      onClick: () => router.push("/shop/shop_left_sidebar"),
                    }}
                  >
                    {Showdetails}
                  </Btn>
                </div>
              </div>
            </div>
          );
        });
      })}
    </Slider>
  );
};

export default MainSliderCard;

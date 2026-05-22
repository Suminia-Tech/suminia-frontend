import { CommonPath } from "@/Constant";
import Link from "next/link";
import { Col } from "reactstrap";
import Img from "../../Element/Images";

const LeftBanner = ({ elem }) => {
  return (
    <Col xl="5" lg="4" md="6" className="custom-col">
      <div className="collection-banner p-center text-center">
        <a className="banner-img bg-size">
          <Img src={`${CommonPath}/${elem.image}`} className="bg-img" alt="banner-img" />
        </a>
        <Link href={"/shop/shop_left_sidebar"} className="contain-banner">
          <div className="banner-content with-bg">
            <h2 className="mb-2 mins-spacing">{elem.heading}</h2>
            <span className="s-spacing">{elem.subheading}</span>
          </div>
        </Link>
      </div>
    </Col>
  );
};

export default LeftBanner;

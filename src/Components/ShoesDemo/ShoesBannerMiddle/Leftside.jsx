import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import { Btn } from "../../AbstractElements";
import { CommonPath, ShopNow } from "@/Constant";
import Img from "../../Element/Images";

const Leftside = ({ elem }) => {
  const router = useRouter();
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <Col lg="6" className="ratio2_1">
      <div className="collection-banner p-right text-right">
        <a className="banner-img bg-size">
          <Img src={`${CommonPath}/${elem.leftbanner.image}`} alt="banner" className="bg-img" />
        </a>
        <div className="banner-text">
          <div className="banner-content">
            <h6>
              {elem.leftbanner.titleleft} <span className="theme-color">{elem.leftbanner.titleright}</span>
            </h6>
            <h2>
              {elem.leftbanner.headingtop} <br /> {elem.leftbanner.headingbottom}
              <span className="theme-color d-block">
                {symbol}
                {(elem.leftbanner.price * currencyValue).toFixed(2)}
              </span>
            </h2>
            <Btn
              attrBtn={{
                className: "default-light default-theme mt-md-2 mt-1 rounded",
                onClick: () => router.push("/shop/shop_left_sidebar"),
              }}
            >
              {ShopNow}
            </Btn>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default Leftside;

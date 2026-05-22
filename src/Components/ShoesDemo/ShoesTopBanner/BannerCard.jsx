import { BUYNOW, CommonPath } from "@/Constant";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import { Btn } from "../../AbstractElements";
import Img from "../../Element/Images";

const BannerCard = ({ BannerFilter }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const router = useRouter();
  return (
    <Row>
      {BannerFilter.map((el) => {
        return el.banners.map((elem, i) => {
          return (
            <Col lg="6" className={`${elem.class ? " mt-lg-0 mt-4" : ""}`} key={i}>
              <div className="poster-image bg-size">
                <Img src={`${CommonPath}/${elem.image}`} alt="poster" className="bg-img" />
                <div className="poster-image-details">
                  <div>
                    <h5>{elem.topTitle}</h5>
                    <h2>{elem.heading}</h2>
                    <p className="d-sm-block d-none my-1">{elem.feature}</p>
                    <h3>
                      {symbol}
                      {(elem.price * currencyValue).toFixed(2)}
                      <span>
                        <del>
                          {symbol}
                          {(elem.mrp * currencyValue).toFixed(2)}
                        </del>
                      </span>
                    </h3>
                    <Btn
                      attrBtn={{
                        className: "btn-solid-default",
                        onClick: () => router.push("/shop/shop_left_sidebar"),
                      }}
                    >
                      {BUYNOW}
                    </Btn>
                  </div>
                </div>
              </div>
            </Col>
          );
        });
      })}
    </Row>
  );
};

export default BannerCard;

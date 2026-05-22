import { useRouter } from "next/navigation";
import { Heart } from "react-feather";
import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import { Btn } from "../../AbstractElements";
import { CommonPath } from "@/Constant";
import CountDown from "../../Element/CountDown";
import Img from "@/Components/Element/Images";

const DealCard = ({ bannerData }) => {
  const router = useRouter();
  const DealFilter = bannerData.filter((el) => el.subtype === "furnituredeal");
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const themeColor = true;
  return (
    <>
      {DealFilter.map((elem, i) => {
        return (
          <Col md="12" className="px-0" key={i}>
            <div className="discount-image-details-1">
              <div className="discount-images">
                <div className="theme-circle"></div>
                <Img src={`${CommonPath}/${elem.image}`} className="img-fluid shoes-images" alt="discount" />
              </div>
              <div className="discunt-details mt-xl-0 mt-4">
                <div>
                  <div className="heart-button">
                    <Heart />
                  </div>
                  <div className="discount-shop">
                    <h2 className="text-spacing">{elem.lefthead}</h2>
                    <h6>{elem.leftsubhead}</h6>
                  </div>
                  <h5 className="mt-3">
                    {elem.mainhead1} <span className="theme-color">{elem.offer}</span>
                  </h5>
                  <h2 className="my-2 deal-text">
                    {elem.mainhead2} <br />
                    {elem.mainhead3}{" "}
                    <span className="theme-color">
                      {symbol}
                      {(elem.price * currencyValue).toFixed(2)}
                    </span>
                  </h2>
                  <div className="timer-style-2 my-2 justify-content-center d-flex">
                    <CountDown themeColor={themeColor} />
                  </div>
                  <Btn
                    attrBtn={{
                      className: "btn default-light-theme default-theme mt-2",
                      onClick: () => router.push("/shop/shop_left_sidebar"),
                    }}
                  >
                    {elem.lefthead}
                  </Btn>
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default DealCard;

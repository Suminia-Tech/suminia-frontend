import Img from "@/Components/Element/Images";
import { CommonPath, ShopNow } from "@/Constant";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Btn } from "../../AbstractElements";
import CountDown from "../../Element/CountDown";

const DealCard = ({ ShoesDealFilter }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const router = useRouter();
  const themeColor = true;
  return (
    <div className="discount-image-details">
      {ShoesDealFilter.map((elem, i) => {
        return (
          <Fragment key={i}>
            <div className="discount-images">
              <div className="theme-circle"></div>
              <Img src={`${CommonPath}/${elem.image}`} alt="shoes" className="img-fluid shoes-images-1" />
              <Img src={`${CommonPath}/${elem.image}`} alt="shoes" className="img-fluid shoes-images-2" />
            </div>
            <div className="discunt-details mt-xl-0 mt-4">
              <div>
                <div className="heart-button">
                  <i className="fas fa-heart theme-color"></i>
                </div>
                <h5 className="mt-3">
                  {elem.title} <span className="theme-color">{elem.discount}</span>
                </h5>
                <h2 className="my-3 deal-text">
                  {elem.headingtop} <br />
                  {elem.headingbottom}
                  <span className="theme-color">
                    {symbol}
                    {(elem.price * currencyValue).toFixed(2)}
                  </span>
                </h2>
                <div className="timer-style-2 mt-xl-1 my-2 justify-content-center d-flex">
                  <CountDown themeColor={themeColor} />
                </div>
                <Btn attrBtn={{ className: "btn default-light-theme default-theme mt-2", onClick: () => router.push("/shop/shop_left_sidebar") }}>{ShopNow}</Btn>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default DealCard;

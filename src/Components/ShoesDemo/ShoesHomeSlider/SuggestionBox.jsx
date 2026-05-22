import Img from "@/Components/Element/Images";
import { CommonPath } from "@/Constant";
import Link from "next/link";
import { useSelector } from "react-redux";
import DynamicRating from "../../Element/DynamicRating";

const SuggestionBox = ({ elem }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <div className="sugestion-product d-xl-block d-none">
      <h3>{elem.leftTitle}</h3>
      <h6>{elem.leftSubtitle}</h6>
      <Link href={"/shop/shop_left_sidebar"} className="slider-shoes-image d-block">
        <div className="relative-shoes">
          <Img src={`${CommonPath}/${elem.leftImage}`} className="img-fluid" alt="shoes" />
          <div className="shoes-price">
            <h5>
              {symbol}
              {(elem.leftPrice * currencyValue).toFixed(2)}
            </h5>
            <h6>{elem.leftProduct}</h6>
            <DynamicRating data={elem.leftReviewStars} customeclass={"rating d-flex justify-content-between"} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SuggestionBox;

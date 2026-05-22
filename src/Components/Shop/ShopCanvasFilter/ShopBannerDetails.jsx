import { bannerdescription, CommonPath, shopdescription, ShopTheLatestTrends } from "@/Constant";
import Img from "../../Element/Images";

const ShopBannerDetails = () => {
  return (
    <div className="banner-deatils">
      <div className="banner-image">
        <Img src={`${CommonPath}/fashion/banner.jpg`} className="img-fluid bg-img" alt="fashion" />
        <div className="banner-content">
          <div>
            <h3>{ShopTheLatestTrends}</h3>
            <p>{shopdescription}</p>
          </div>
        </div>
      </div>
      <div className="banner-contain mt-3 mb-5">
        <p className="font-light">{bannerdescription}</p>
      </div>
    </div>
  );
};

export default ShopBannerDetails;

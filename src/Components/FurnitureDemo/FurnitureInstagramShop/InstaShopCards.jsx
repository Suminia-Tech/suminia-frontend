import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { InstaSlider } from "../../../Data/SliderSettingsData";
import { Btn } from "../../AbstractElements";
import { CommonPath, ShopNow } from "@/Constant";
import Img from "@/Components/Element/Images";
const InstaShopCards = ({ InstaShopFilter }) => {
  const router = useRouter();
  return (
    <div className="product-style-1">
      <div className="product-wrapper insta-slider instagram-wrap">
        <Slider {...InstaSlider}>
          {InstaShopFilter.map((el) => {
            return el.children.map((elem, i) => {
              return (
                <div key={i}>
                  <div className="product-box product-box1">
                    <div className="img-wrapper bg-transparent">
                      <div className="top-wishlist">
                        <a href="#javascript" className="heart-wishlist ms-auto">
                          <i className="far fa-heart"></i>
                        </a>
                      </div>
                      <a href="#javascript" className="text-center">
                        <Img src={`${CommonPath}/${elem.image}`} className="img-fluid" alt="center" />
                      </a>
                    </div>
                    <div className="insta-hover insta-hover-gradient text-center">
                      <div>
                        <h2>{elem.heading}</h2>
                        <h5>{elem.discount}</h5>
                        <h3 className="brand-name">{elem.title}</h3>
                        <Btn
                          attrBtn={{
                            className: "btn btn-light-white",
                            onClick: () => router.push("/shop/shop_left_sidebar"),
                          }}
                        >
                          {ShopNow}
                          <i className="fas fa-chevron-right ms-2"></i>
                        </Btn>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </Slider>
      </div>
    </div>
  );
};

export default InstaShopCards;

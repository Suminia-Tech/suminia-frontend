import { CommonPath, Share, ShopNow } from "@/Constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { InstaSlider } from "../../../Data/SliderSettingsData";
import { Btn } from "../../AbstractElements";
import Img from "../../Element/Images";

const ElectronicInstaCard = ({ InstaFilter }) => {
  const router = useRouter();
  return (
    <div className="product-style-1 instagram-2">
      <div className="insta-slider product-wrapper instagram-wrap">
        <Slider {...InstaSlider}>
          {InstaFilter.map((el) => {
            return el.children.map((elem, i) => {
              return (
                <div key={i}>
                  <div className="product-box">
                    <div className="img-wrapper">
                      <div className="top-wishlist product-color">
                        <Link href={"/page/wishlist"} className="heart-wishlist heart-color">
                          <i className="far fa-heart"></i>
                        </Link>
                      </div>
                      <div className="share share-box share-opacity">
                        <span className="share-plus share-plus-color">+</span>
                        <span>{Share}</span>
                      </div>
                      <a className="text-center bg-size">
                        <Img src={`${CommonPath}/${elem.image}`} className="bg-img" alt="share" />
                      </a>
                    </div>
                    <div className="insta-hover text-center">
                      <div>
                        <h5>{elem.discount}</h5>
                        <h3 className="text-hide">{elem.title}</h3>
                        <Btn
                          attrBtn={{
                            className: "btn-light-white",
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

export default ElectronicInstaCard;

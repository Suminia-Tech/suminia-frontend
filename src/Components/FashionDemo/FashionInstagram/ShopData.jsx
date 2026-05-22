import { Btn } from "@/Components/AbstractElements";
import Img from "@/Components/Element/Images";
import { CommonPath, ShopNow } from "@/Constant";
import { InstaSlider } from "@/Data/SliderSettingsData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
const ShopData = ({ bannerData }) => {
  const InstaBanner = bannerData?.filter((el) => el.subtype === "fashioninstashop");
  const router = useRouter();
  return (
    <>
      {InstaBanner &&
        InstaBanner.map((el, i) => {
          return (
            <Slider {...InstaSlider} key={i}>
              {el.children.map((elem, i) => {
                return (
                  <div key={i}>
                    <div className="product-box">
                      <div className="img-wrapper">
                        <div className="top-wishlist product-color">
                          <Link href={"/page/wishlist"} className="heart-wishlist heart-color ms-auto theme-color">
                            <i className="far fa-heart"></i>
                          </Link>
                        </div>
                        <div className="share share-box share-opacity">
                          <span className="share-plus share-plus-color">+</span>
                          <span>{elem.share}</span>
                        </div>
                        <a href="#javascript" className="text-center bg-size">
                          <Img src={`${CommonPath}/${elem.image}`} className="bg-img" alt="share-box" />
                        </a>
                      </div>
                      <div className="insta-hover insta-spacing text-center">
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
              })}
            </Slider>
          );
        })}
    </>
  );
};
export default ShopData;

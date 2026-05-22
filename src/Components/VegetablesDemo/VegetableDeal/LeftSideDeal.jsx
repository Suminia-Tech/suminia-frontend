import { CommonPath, OFF, ShopNow } from "@/Constant";
import { useRouter } from "next/navigation";
import { Col } from "reactstrap";
import { Btn } from "../../AbstractElements";
import CountDown from "../../Element/CountDown";
import Img from "../../Element/Images";

const LeftSideDeal = ({ elem }) => {
  const router = useRouter();
  return (
    <Col xl="9" lg="8">
      <div className="timer-banner text-center bg-size">
        <Img src={`${CommonPath}/${elem.image}`} alt="vegetable" className="bg-img" />
        <Img src={`${CommonPath}/${elem.fruitsimage}`} className="img-fluid veg-image" alt="vegetable" />
        <Img src={`${CommonPath}/${elem.cirleimage}`} className="round-circle" alt="vegetable" />
        <div className="coupon-code theme-color">{elem.couponcode}</div>
        <div className="discount-offer">
          <h5>
            {elem.lefttext}
            <span className="theme-color">
              {elem.discount}% {OFF}
              <span className="wishlist-icon mt-2">
                <i className="fas fa-heart"></i>
              </span>
            </span>
          </h5>
        </div>

        <div className="timer">
          <CountDown customeclass={"light-color"} />
        </div>

        <div className="banner-btn-grup">
          <Btn
            attrBtn={{
              className: "btn-solid-default",
              onClick: () => router.push("/shop/shop_left_sidebar"),
            }}
          >
            {ShopNow}
          </Btn>
        </div>

        <div className="social-media">
          {elem.socialmedia.map((item, i) => {
            return (
              <div className="social-icon" key={i}>
                <Img src={`${CommonPath}/${item.image}`} className="img-fluid" alt="vegetable" />
                <h6>{item.title}</h6>
              </div>
            );
          })}
        </div>
      </div>
    </Col>
  );
};

export default LeftSideDeal;

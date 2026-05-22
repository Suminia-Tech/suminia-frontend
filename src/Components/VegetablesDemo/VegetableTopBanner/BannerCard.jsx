import Link from "next/link";
import { useRouter } from "next/navigation";
import { Col } from "reactstrap";
import { Btn } from "../../AbstractElements";
import { CommonPath, LearnMore, OFF } from "@/Constant";
import Img from "../../Element/Images";

const BannerCard = ({ VegeTopFilter }) => {
  const router = useRouter();
  return (
    <>
      {VegeTopFilter.map((el) => {
        return el.banners.map((elem, i) => {
          return (
            <Col lg="4" className={`${elem.class ? "col-xl-3 order-lg-0 order-md-1 order-0" : "col-xl-5 col-md-6 custom-col"}`} key={i}>
              {elem.childtype === "middlebanner" ? (
                <div className="collection-banner text-center collection-center p-0">
                  <div className="banner-img bg-size">
                    <Img src={`${CommonPath}/${elem.image}`} alt="collection" className="bg-img" />
                  </div>
                  <div className="contain-banner contain-center bottom-0">
                    <div className="banner-content p-2">
                      <h6 className="theme-color mb-2">{elem.smallheading}</h6>
                      <h2>{elem.headingtop} </h2>
                      <h2>{elem.headingbottom}</h2>
                      <p className="mt-2">{elem.subheading}</p>
                      <Btn attrBtn={{ className: "btn-solid-default", onClick: () => router.push("/shop/shop_left_sidebar") }}>{LearnMore}</Btn>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="collection-banner text-center">
                  <div className="banner-img bg-size">
                    <Img src={`${CommonPath}/${elem.image}`} alt="banner" className="bg-img" />
                  </div>
                  <div className="banner-detail">
                    <a href="#javascript" className="heart-wishlist">
                      <i className="far fa-heart"></i>
                    </a>
                    <span className="font-dark-30">
                      {elem.discount}% <span>{OFF}</span>
                    </span>
                  </div>
                  <Link href={"/shop/shop_left_sidebar"} className="contain-banner contain-center bottom-0">
                    <div className="banner-content with-bg">
                      <h2 className="mb-2">{elem.heading}</h2>
                      <span>{elem.subheading}</span>
                    </div>
                  </Link>
                </div>
              )}
            </Col>
          );
        });
      })}
    </>
  );
};

export default BannerCard;

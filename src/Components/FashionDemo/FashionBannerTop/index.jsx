import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { CommonPath, OFF } from "@/Constant";
import Img from "../../Element/Images";

const FashionBannerTop = ({ bannerData, elemclass }) => {
  const TopBanner = bannerData?.filter((el) => el.subtype === "fashiontopbanner");
  return (
    <section className={`ratio2_1 banner-style-2 ${elemclass}`}>
      <Container>
        <Row className="gy-4">
          {TopBanner &&
            TopBanner.map((el) => {
              return el?.children?.map((item, i) => {
                return (
                  <Col lg="4" className={`${item.class ? "" : "col-md-6"}`} key={i}>
                    <div className="collection-banner p-bottom p-center text-center">
                      <a href="#javascript" className="banner-img bg-size">
                        <Img src={`${CommonPath}/${item.image}`} className="bg-img" alt="collection" />
                      </a>
                      <div className="banner-detail">
                        <a href="#javascript" className="heart-wishlist">
                          <i className="far fa-heart"></i>
                        </a>
                        <span className="font-dark-30">
                          {item.discount}% <span>{OFF}</span>
                        </span>
                      </div>
                      <Link href={"/shop/shop_left_sidebar"} className="contain-banner">
                        <div className="banner-content with-big">
                          <h2 className="mb-2">{item.heading}</h2>
                          <span>{item.subheading}</span>
                        </div>
                      </Link>
                    </div>
                  </Col>
                );
              });
            })}
        </Row>
      </Container>
    </section>
  );
};
export default FashionBannerTop;

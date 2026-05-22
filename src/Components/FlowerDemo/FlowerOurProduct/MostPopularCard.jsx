import Img from "@/Components/Element/Images";
import { CommonPath } from "@/Constant";
import Link from "next/link";
import { Col, Row } from "reactstrap";

const MostPopularCard = ({ productData }) => {
  const FlowerProductFilter = productData.filter((el) => el.type === "flower");
  return (
    <div>
      <Row className="g-3">
        {FlowerProductFilter.slice(0, 5).map((elem, i) => {
          return (
            <Col lg="12" md="6" xs="12" key={i}>
              <div className="product-image">
                <Link href="#Javascript">
                  <Img src={`${CommonPath}/${elem.images[0].src}`} alt="product-image" />
                </Link>
                <div className="product-details">
                  <h6 className="font-light">{elem.feature}</h6>
                  <Link href={`/product/product_left_sidebar/${elem.id}`}>
                    <h3>{elem.name}</h3>
                  </Link>
                  <h4 className="font-light mt-1">
                    <del>${elem.price}.00</del> <span className="theme-color">${elem.mrp}.50</span>
                  </h4>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default MostPopularCard;

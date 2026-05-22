import { Col, Row } from "reactstrap";
import { CommonPath } from "@/Constant";
import AddToCartProduct from "../../Element/AddToCart";
import AddToWishList from "../../Element/AddToWishList";
import CompareProducts from "../../Element/CompareProducts";
import Img from "@/Components/Element/Images";

const SliderCard = ({ elem }) => {
  const staticActions = true;
  return (
    <div>
      <Row className="g-3">
        {elem.children.slice(0, 4).map((item, i) => {
          return (
            <Col lg="12" md="6" xs="12" key={i}>
              <div className="product-image">
                <a>
                  <Img src={`${CommonPath}/${item.image}`} alt="furniture" />
                </a>
                <div className="product-details">
                  <a>
                    <h6 className="font-light">{item.description}</h6>
                    <h3>{item.productName}</h3>
                    <h4 className="font-light mt-1">
                      <del>${item.mrp}</del> <span className="theme-color">${item.price}</span>
                    </h4>
                  </a>
                  <div className="cart-wrap">
                    <ul>
                      <AddToCartProduct elem={elem} staticActions={staticActions} />
                      <CompareProducts elem={elem} staticActions={staticActions} />
                      <AddToWishList elem={elem} staticActions={staticActions} />
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default SliderCard;

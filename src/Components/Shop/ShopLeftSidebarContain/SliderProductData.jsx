import { CommonPath } from "@/Constant";
import Link from "next/link";
import { Col } from "reactstrap";
import { ShopFilterSliderData } from "../../../Data/ShopFilterSliderData";
import Img from "@/Components/Element/Images";

const SliderProductData = ({ val, val1 }) => {
  return (
    <>
      {ShopFilterSliderData.slice(val, val1).map((elem) => (
        <Col xs="12" key={elem.id}>
          <div className="product-image">
            <Link href={"/product/product_left_sidebar/1"}>
              <Img src={`${CommonPath}${elem.img}`} alt="shop" />
            </Link>
            <div className="product-details">
              <h6 className="font-light">{elem.title}</h6>
              <Link href={"/product/product_left_sidebar/1"}>
                <h3>{elem.name}</h3>
              </Link>
              <h4 className="font-light mt-1">
                <del>{elem.mrp}</del> <span className="theme-color">{elem.price}</span>
              </h4>
            </div>
          </div>
        </Col>
      ))}
    </>
  );
};

export default SliderProductData;

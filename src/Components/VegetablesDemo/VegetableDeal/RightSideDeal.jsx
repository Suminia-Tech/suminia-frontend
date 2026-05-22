import { CommonPath, ShopNow } from "@/Constant";
import { useRouter } from "next/navigation";
import { Col } from "reactstrap";
import { Btn } from "../../AbstractElements";
import Img from "../../Element/Images";

const RightSideDeal = ({ elem }) => {
  const router = useRouter();
  return (
    <Col xl="3" lg="4" className="small-banner">
      <div className="collection-banner text-center collection-center bg-size">
        <Img src={`${CommonPath}/${elem.rightimage}`} alt="vegetable" className="bg-img" />
        <div>
          <h6 className="theme-color mb-2">{elem.rightsmallheading}</h6>
          <h2>{elem.rightsmallheading} </h2>
          <h2>{elem.rightheadingbottom}</h2>
          <p className="mt-2 mb-0 font-light">{elem.bottomsmalltop} </p>
          <p className="font-light mb-0"> {elem.bottomsmallbottom}</p>
          <Btn
            attrBtn={{
              className: "btn-solid-default mt-4",
              onClick: () => router.push("/shop/shop_left_sidebar"),
            }}
          >
            {ShopNow}
          </Btn>
        </div>
      </div>
    </Col>
  );
};

export default RightSideDeal;

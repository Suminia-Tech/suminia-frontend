import { LearnMore } from "@/Constant";
import { useRouter } from "next/navigation";
import { Col } from "reactstrap";
import { Btn } from "../../AbstractElements";

const MiddleBanner = ({ elem }) => {
  const router = useRouter();
  return (
    <Col xl="3" lg="4" className="order-lg-0 order-md-1 order-0">
      <div className="collection-banner text-center collection-center">
        <h6 className="theme-color mb-2">{elem.smallheading}</h6>
        <h2>{elem.headingtop} </h2>
        <h2>{elem.headingbottom}</h2>
        <p className="mt-2">{elem.subheading}</p>
        <Btn attrBtn={{ className: "btn-solid-default", onClick: () => router.push("/shop/shop_left_sidebar") }}>{LearnMore}</Btn>
      </div>
    </Col>
  );
};

export default MiddleBanner;

import Img from "@/Components/Element/Images";
import { CommonPath } from "@/Constant";
import Link from "next/link";
import { Slide } from "react-awesome-reveal";

const ContainCard = ({ elem }) => {
  return (
    <div>
      <Slide direction="up" duration="2000">
        <h4 className="theme-color mb-2" data-animation-in="fadeInUp">
          {elem.right.heading}
        </h4>
        <h6 className="mb-4" data-animation-in="fadeInUp" data-delay-in="0.3">
          {elem.right.subheading}
        </h6>
        <p className="mb-0 text-dark" data-animation-in="fadeInUp" data-delay-in="0.4">
          {elem.right.description}
        </p>
        <div className="product-img" data-animation-in="fadeInUp" data-delay-in="0.5">
          <ul>
            {elem?.images?.map((item, i) => {
              return (
                <li key={i}>
                  <Link href={"/shop/shop_left_sidebar"}>
                    <Img src={`${CommonPath}/${item.src}`} className="img-fluid" alt="shop_left" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Slide>
    </div>
  );
};

export default ContainCard;

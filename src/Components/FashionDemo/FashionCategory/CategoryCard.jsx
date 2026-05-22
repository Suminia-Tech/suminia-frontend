import Link from "next/link";
import Slider from "react-slick";
import { CommonPath } from "@/Constant";
import { CategoryBannerSlider } from "@/Data/SliderSettingsData";
import Img from "@/Components/Element/Images";

const CategoryCard = ({ categoryBanner }) => {
  const CategoryFilter = categoryBanner?.filter((el) => el.type === "fashion");
  return (
    <Slider {...CategoryBannerSlider}>
      {CategoryFilter?.map((el) => {
        return el.categories.map((elem, i) => {
          return (
            <div key={i}>
              <Link href={`/shop/shop_left_sidebar`} className="category-wrap category-padding">
                <Img src={`${CommonPath}/${elem.image}`} className="bg-img" alt="collection" />
                <div className="category-content category-text-1">
                  <h3 className="theme-color">{elem.title}</h3>
                  <span className="text-dark">{elem.subtitle}</span>
                </div>
              </Link>
            </div>
          );
        });
      })}
    </Slider>
  );
};

export default CategoryCard;

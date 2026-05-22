import ElementProduct1 from "./ElementProduct1";
import ElementProduct2 from "./ElementProduct2";
import ElementProduct3 from "./ElementProduct3";
import ElementProduct4 from "./ElementProduct4";
import ElementProduct6 from "./ElementProduct6";

const ElementProductContain = ({ productData, bannerData }) => {
  const ProductFilter = productData?.filter((el) => el.type === "electronic");
  const FilterVrProduct = productData?.filter((el) => el.type === "electronic");
  const FreshFilter = productData.filter((el) => el.type === "vegetables");
  const OfferFilter = bannerData.filter((el) => el.subtype === "fruitsbanner");
  return (
    <section>
      <ElementProduct1 ProductFilter={ProductFilter} />
      <ElementProduct2 FilterVrProduct={FilterVrProduct} />
      <ElementProduct3 FreshFilter={FreshFilter} />
      <ElementProduct4 OfferFilter={OfferFilter} />
      <ElementProduct6 productData={productData} />
    </section>
  );
};

export default ElementProductContain;

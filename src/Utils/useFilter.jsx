/* eslint-disable react-hooks/exhaustive-deps */
import { BRAND, CATEGORY, COLOR, PRICEFILTER, SORTBYTYPE } from "@/ReduxToolkit/Reducers/ProductFilterReducer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useFilter = (products) => {
  const searchParams = useSearchParams();
  const path = usePathname();
  const [filterProduct, setFilterProduct] = useState(products);
  const [work, setWork] = useState(false);
  const router = useRouter();
  const { brand, color, category, price, sorting, discount } = useSelector((state) => state.ProductFilter);
  const storedData = useSelector((state) => state.ProductFilter);
  const dispatch = useDispatch();
  const Data = searchParams.get("filterDetails");
  var oldData = Data && !!Object.keys(JSON.parse(Data)).length && JSON.parse(decodeURIComponent(Data));

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  useEffect(() => {
    oldData && !!oldData.brand?.length && !arraysEqual(oldData.brand, storedData.brand) && dispatch(BRAND(oldData.brand));
    oldData && !!oldData.color?.length && !arraysEqual(oldData.color, storedData.color) && dispatch(COLOR(oldData.color));
    oldData && !!oldData.price?.length && !arraysEqual(oldData.price, storedData.price) && dispatch(PRICEFILTER(oldData.price));
    oldData && !!oldData.category?.length && !arraysEqual(oldData.category, storedData.category) && dispatch(CATEGORY(oldData.category));
    oldData && !!oldData.sortByType?.length && !arraysEqual(oldData.sortByType, storedData.sortByType) && dispatch(SORTBYTYPE(oldData.sortByType));
  }, [Data]);

  useEffect(() => {
    setFilterProduct(
      products
        ?.filter((product) => {
          let filterBrand = brand.length ? brand.includes(product.brand) : true;
          let filterCategory = category.length ? category.includes(product.type) || category.includes("All") : true;
          let filterColor = color.length ? color.map((item) => product.colors.includes(item)).includes(true) : true;
          let priceMatch = price ? price[0] <= product.price && price[1] >= product.price : true;
          let filterDiscount = discount.length ? product?.discount > discount : true;
          return filterBrand && filterColor && filterCategory && priceMatch && filterDiscount;
        })
        .sort((product1, product2) => {
          if (sorting === "Price, High To Low") {
            return product2.price < product1.price ? -1 : 1;
          } else if (sorting === "Price, Low To High") {
            return product2.price > product1.price ? -1 : 1;
          } else if (sorting === "Alphabetically A-Z") {
            return product1.name < product2.name ? -1 : 1;
          } else if (sorting === "Alphabetically Z-A") {
            return product1.name > product2.name ? -1 : 1;
          } else {
            return product2.price !== product1.price ? 1 : 1;
          }
        })
    );
    const dataa = encodeURIComponent(JSON.stringify(storedData));
    work && router.push(`${path}?filterDetails=${dataa}`);
    setTimeout(() => {
      setWork(true);
    }, 2000);
  }, [brand, color, category, price, products, sorting, discount, storedData, router, path, work]);

  return filterProduct;
};

export default useFilter;

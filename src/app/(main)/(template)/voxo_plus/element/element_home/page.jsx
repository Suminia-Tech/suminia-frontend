"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import ElementElectronic from "@/_template/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementElectronic";
import ElementFashion from "@/_template/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementFashion";
import ElementFlower from "@/_template/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementFlower";
import ElementFurniture from "@/_template/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementFurniture";
import ElementShoes from "@/_template/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementShoes";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import { getAPIData } from "@/_template/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";

const ElementHome = () => {
  const [mainSlider, setMainSlider] = useState([]);
  useEffect(() => {
    const types = ["homeslider"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "homeslider" && setMainSlider(res?.data);
      });
    });
  }, []);
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Element Home"} title={"Element Home"} />
      <ElementFlower mainSlider={mainSlider} />
      <ElementElectronic mainSlider={mainSlider} />
      <ElementFashion mainSlider={mainSlider} />
      <ElementFurniture mainSlider={mainSlider} />
      <ElementShoes mainSlider={mainSlider} />
</Layout6>
  );
};

export default ElementHome;

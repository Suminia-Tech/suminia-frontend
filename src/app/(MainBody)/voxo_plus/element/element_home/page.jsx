"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import ElementElectronic from "@/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementElectronic";
import ElementFashion from "@/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementFashion";
import ElementFlower from "@/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementFlower";
import ElementFurniture from "@/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementFurniture";
import ElementShoes from "@/Components/VoxoPlus/ElementPage/ElementHomeContain/ElementShoes";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import { getAPIData } from "@/Utils";
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
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Element Home"} title={"Element Home"} />
      <ElementFlower mainSlider={mainSlider} />
      <ElementElectronic mainSlider={mainSlider} />
      <ElementFashion mainSlider={mainSlider} />
      <ElementFurniture mainSlider={mainSlider} />
      <ElementShoes mainSlider={mainSlider} />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default ElementHome;

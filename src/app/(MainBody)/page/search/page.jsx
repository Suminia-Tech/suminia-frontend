"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ArrivalCards from "@/Components/FashionDemo/FashionNewArrival/ArrivalCards";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import SearchContain from "@/Components/Pages/Search/SearchContain";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import { getAPIData } from "@/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";

const Search = () => {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    const type = "products";
    getAPIData(`/api/${type}`).then((res) => {
      setProductData(res?.data);
    });
  }, []);
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Search"} title={"Search"} />
      <SearchContain />
      <section className="ratio_asos section-b-space">
        <Container>
          <ArrivalCards productData={productData} />
        </Container>
      </section>
      <FlowerSubscribe />
    </Layout1>
  );
};

export default Search;

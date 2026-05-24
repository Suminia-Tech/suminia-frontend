"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import SearchContain from "@/Components/Pages/Search/SearchContain";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
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
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Búsqueda"} title={"Búsqueda"} />
      <SearchContain />
      <section className="ratio_asos section-b-space">
        <Container>
</Container>
      </section>
</Layout6>
  );
};

export default Search;

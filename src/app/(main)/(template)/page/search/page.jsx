"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import SearchContain from "@/_template/Components/Pages/Search/SearchContain";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import { getAPIData } from "@/_template/Utils";
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

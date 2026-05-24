"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
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
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Búsqueda"} title={"Búsqueda"} />
      <SearchContain />
      <section className="ratio_asos section-b-space">
        <Container>
</Container>
      </section>
</Layout1>
  );
};

export default Search;

"use client";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import PortFolioGridContain from "@/_template/Components/VoxoPlus/PortfolioPage/PortFolioGrid";
import { GETPORTFOLIODATA } from "@/_template/ReduxToolkit/Reducers/PortfolioReducer";
import { getAPIData } from "@/_template/Utils";

const Portfolio3Grid = () => {
  const dispatch = useDispatch();
  const { portfoliodata } = useSelector((state) => state.PortfolioReducer);
  useEffect(() => {
    if (!portfoliodata) {
      getAPIData(`/api/portfolio`).then((res) => {
        dispatch(GETPORTFOLIODATA(res?.data));
      });
    }
  }, [dispatch, portfoliodata]);
  const colclass = "col-lg-3 col-md-4 col-sm-6";
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Portfolio Grid"} title={"Portfolio Grid"} />
      <PortFolioGridContain portfoliodata={portfoliodata} colclass={colclass} />
</Layout6>
  );
};

export default Portfolio3Grid;

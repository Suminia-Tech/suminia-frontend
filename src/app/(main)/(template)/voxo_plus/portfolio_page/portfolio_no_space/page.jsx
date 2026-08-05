"use client";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import PortfolioMasonaryContain from "@/_template/Components/VoxoPlus/PortfolioPage/PortfolioMasonary";
import { getAPIData } from "@/_template/Utils";
import { GETPORTFOLIODATA } from "@/_template/ReduxToolkit/Reducers/PortfolioReducer";

const PortfolioNoSpace = () => {
  const dispatch = useDispatch();
  const { portfoliodata } = useSelector((state) => state.PortfolioReducer);
  useEffect(() => {
    if (!portfoliodata) {
      getAPIData(`/api/portfolio`).then((res) => {
        dispatch(GETPORTFOLIODATA(res?.data));
      });
    }
  }, [dispatch, portfoliodata]);
  const colclass = "col-lg-4 col-md-12";
  const masonaryclass = 3;
  const rowclass = "g-0";
  const noSpace = true;
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Portfolio Masonary"} title={"Portfolio Masonary"} />
      <PortfolioMasonaryContain portfoliodata={portfoliodata} colclass={colclass} masonaryclass={masonaryclass} rowclass={rowclass} noSpace={noSpace} />
</Layout6>
  );
};

export default PortfolioNoSpace;

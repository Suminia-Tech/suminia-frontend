"use client";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import PortfolioMasonaryContain from "@/Components/VoxoPlus/PortfolioPage/PortfolioMasonary";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import { GETPORTFOLIODATA } from "@/ReduxToolkit/Reducers/PortfolioReducer";
import { getAPIData } from "@/Utils";

const Portfolio4Masonary = () => {
  const dispatch = useDispatch();
  const { portfoliodata } = useSelector((state) => state.PortfolioReducer);
  useEffect(() => {
    if (!portfoliodata) {
      getAPIData(`/api/portfolio`).then((res) => {
        dispatch(GETPORTFOLIODATA(res?.data));
      });
    }
  }, [dispatch, portfoliodata]);
  const colclass = "col-xl-3 col-md-4 col-sm-6";
  const masonaryclass = 4;
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Portfolio Masonary"} title={"Portfolio Masonary"} />
      <PortfolioMasonaryContain portfoliodata={portfoliodata} colclass={colclass} masonaryclass={masonaryclass} />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default Portfolio4Masonary;

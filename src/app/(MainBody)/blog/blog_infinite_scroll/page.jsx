"use client";
import BlogInfiniteScroll from "@/Components/Blog/BlogInfiniteScroll";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";
import { getAPIData } from "@/Utils";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Blog_infinite_scroll = () => {
  const dispatch = useDispatch();
  const { Blogdatanew } = useSelector((state) => state.BlogReducer);
  useEffect(() => {
    if (!Blogdatanew) {
      getAPIData(`/api/blog`).then((res) => {
        dispatch(GETBLOGDATA(res?.data));
      });
    }
  }, [Blogdatanew, dispatch]);
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Blog Infinite Scroll"} title={"Blog Infinite Scroll"} />
      <BlogInfiniteScroll />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default Blog_infinite_scroll;

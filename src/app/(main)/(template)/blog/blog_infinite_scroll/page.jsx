"use client";
import BlogInfiniteScroll from "@/_template/Components/Blog/BlogInfiniteScroll";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import { GETBLOGDATA } from "@/_template/ReduxToolkit/Reducers/BlogReducer";
import { getAPIData } from "@/_template/Utils";
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
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Blog"} title={"Blog"} />
      <BlogInfiniteScroll />
</Layout6>
  );
};

export default Blog_infinite_scroll;

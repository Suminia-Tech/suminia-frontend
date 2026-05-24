"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPath } from "@/Constant";
import BlogDetails from "@/Components/Blog/BlogDetails";
import RelatedBlog from "@/Components/Blog/BlogDetails/RelatedBlog";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";
import { getAPIData } from "@/Utils";

const Blog_details = () => {
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
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Blog"} title={"Blog"} />
      <BlogDetails />
      <RelatedBlog />
</Layout1>
  );
};

export default Blog_details;

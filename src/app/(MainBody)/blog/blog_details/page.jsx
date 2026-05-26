"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import Layout6 from "@/Layout/Layout6";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CommonPath } from "@/Constant";
import BlogDetails from "@/Components/Blog/BlogDetails";
import RelatedBlog from "@/Components/Blog/BlogDetails/RelatedBlog";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";
import { getAPIData } from "@/Utils";
import { useSearchParams } from "next/navigation";

const Blog_details = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const articleId = Number(searchParams.get("id") ?? 0);

  useEffect(() => {
    getAPIData(`/api/blog`).then((res) => {
      dispatch(GETBLOGDATA(res?.data));
    });
  }, [dispatch]);

  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Blog"} title={"Blog"} />
      <BlogDetails articleId={articleId} />
      <RelatedBlog />
    </Layout6>
  );
};

export default Blog_details;

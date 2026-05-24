"use client";
import BlogMasonaryContain from "@/Components/Blog/BlogMasonary";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const BlogMasonary = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Blog Masonary"} title={"Blog Masonary"} />
      <BlogMasonaryContain />
</Layout1>
  );
};

export default BlogMasonary;

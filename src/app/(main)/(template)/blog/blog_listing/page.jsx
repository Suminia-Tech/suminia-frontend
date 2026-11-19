"use client";
import BlogListinfContain from "@/_template/Components/Blog/BlogListing";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";

const BlogListing = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BlogListinfContain />
</Layout6>
  );
};

export default BlogListing;

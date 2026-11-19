"use client";
import BlogRightSidebarContain from "@/_template/Components/Blog/BlogRightSidebar";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";

const BlogRightSidebar = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BlogRightSidebarContain />
</Layout6>
  );
};

export default BlogRightSidebar;

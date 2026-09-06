"use client";
import BlogRightSidebarContain from "@/_template/Components/Blog/BlogRightSidebar";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
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
      <BreadCrumb parent={"Blog"} title={"Blog"} />
      <BlogRightSidebarContain />
</Layout6>
  );
};

export default BlogRightSidebar;

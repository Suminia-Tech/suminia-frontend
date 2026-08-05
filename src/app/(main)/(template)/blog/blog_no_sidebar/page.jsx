"use client";
import BlogNoSidebarContain from "@/_template/Components/Blog/BlogNoSider";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";

const BlogNoSidebar = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Blog"} title={"Blog"} />
      <BlogNoSidebarContain />
</Layout6>
  );
};

export default BlogNoSidebar;

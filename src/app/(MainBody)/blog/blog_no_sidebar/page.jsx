"use client";
import BlogNoSidebarContain from "@/Components/Blog/BlogNoSider";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const BlogNoSidebar = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Blog No Sidebar"} title={"Blog No Sidebar"} />
      <BlogNoSidebarContain />
</Layout1>
  );
};

export default BlogNoSidebar;

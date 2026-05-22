import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import LeftSidebar from "../BlogDetails/LeftSidebar";
import PaginationSidebar from "../BlogNoSider/PaginationSidebar";
import RigthSidebarCard from "./RigthSidebarCard";
import { getAPIData } from "@/Utils";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";

const BlogRightSidebarContain = () => {
  const dispatch = useDispatch();
  const { Blogdatanew } = useSelector((state) => state.BlogReducer);
  useEffect(() => {
    if (!Blogdatanew) {
      getAPIData(`/api/blog`).then((res) => {
        dispatch(GETBLOGDATA(res?.data));
      });
    }
  }, [Blogdatanew, dispatch]);
  const BlogDataFilter = Blogdatanew && Blogdatanew.filter((el) => el.type === "blogcard");
  return (
    <section className="left-sidebar-section masonary-blog-section section-b-space">
      <Container>
        <Row className="g-4">
          <Col lg="9" md="7" className="ratio3_2">
            <RigthSidebarCard BlogDataFilter={BlogDataFilter} />
            <PaginationSidebar />
          </Col>
          <LeftSidebar />
        </Row>
      </Container>
    </section>
  );
};

export default BlogRightSidebarContain;

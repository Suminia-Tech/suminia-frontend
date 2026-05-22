import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import BlogCards from "./BlogCards";
import PaginationSidebar from "./PaginationSidebar";
import { getAPIData } from "@/Utils";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";

const BlogNoSidebarContain = () => {
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
          <Col xs="12" className="ratio3_2">
            <BlogCards BlogDataFilter={BlogDataFilter} />
            <PaginationSidebar />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BlogNoSidebarContain;

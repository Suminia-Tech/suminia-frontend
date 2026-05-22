import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import PaginationComp from "../../Element/Pagination";
import LeftSidebar from "../BlogDetails/LeftSidebar";
import BlogListCard from "./BlogListCard";
import { getAPIData } from "@/Utils";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";

const BlogListinfContain = () => {
  const dispatch = useDispatch();
  const addClass = "section-b-space";
  const { Blogdatanew } = useSelector((state) => state.BlogReducer);
  useEffect(() => {
    if (!Blogdatanew) {
      getAPIData(`/api/blog`).then((res) => {
        dispatch(GETBLOGDATA(res?.data));
      });
    }
  }, [Blogdatanew, dispatch]);
  const BlogDataFilter = Blogdatanew && Blogdatanew.filter((el) => el.type === "blogcard");

  const StoreBlog = BlogDataFilter[0]?.blogs;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const indexOfLastPost = currentPage * dataPerPage;
  const indexOfFirstPost = indexOfLastPost - dataPerPage;
  const currentData = StoreBlog && StoreBlog?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber < currentData?.length) {
      setCurrentPage(pageNumber);
    }
  };
  return (
    <Fragment>
      <section className="left-sidebar-section masonary-blog-section">
        <Container>
          <Row className="g-4">
            <Col lg="9" md="7" className="order-md-1 ratio_square">
              <Row className="g-4 g-xl-5">
                <BlogListCard currentData={currentData} />
              </Row>
            </Col>
            <LeftSidebar />
          </Row>
        </Container>
      </section>
      <PaginationComp addClass={addClass} dataPerPage={dataPerPage} StoreProductLength={StoreBlog?.length} currentPage={currentPage} paginate={paginate} />
    </Fragment>
  );
};

export default BlogListinfContain;

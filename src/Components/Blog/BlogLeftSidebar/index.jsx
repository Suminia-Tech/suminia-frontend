import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import PaginationComp from "../../Element/Pagination";
import LeftSidebar from "../BlogDetails/LeftSidebar";
import ProductCard from "./ProductCard";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";
import { getAPIData } from "@/Utils";

const BlogLeftSidebar = () => {
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
  const StoreBlog = BlogDataFilter[0]?.blogs;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(8);
  const indexOfLastPost = currentPage * dataPerPage;
  const indexOfFirstPost = indexOfLastPost - dataPerPage;
  const currentData = StoreBlog && StoreBlog?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber < currentData?.length) {
      setCurrentPage(pageNumber);
    }
  };
  return (
    <section id="portfolio" className="left-sidebar-section masonary-blog-section section-b-space">
      <Container>
        <Row className="g-4">
          <Col lg="9" md="7" className="order-md-1 ratio3_2">
            <ProductCard currentData={currentData} />
            <Col xs="12">
              <PaginationComp dataPerPage={dataPerPage} StoreProductLength={StoreBlog?.length} currentPage={currentPage} paginate={paginate} />
            </Col>
          </Col>
          <LeftSidebar />
        </Row>
      </Container>
    </section>
  );
};

export default BlogLeftSidebar;

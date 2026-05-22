import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import MasonryCard from "./MasonryCard";
import { getAPIData } from "@/Utils";
import { GETBLOGDATA } from "@/ReduxToolkit/Reducers/BlogReducer";

const BlogMasonaryContain = () => {
  const dispatch = useDispatch();
  const { Blogdatanew } = useSelector((state) => state.BlogReducer);
  useEffect(() => {
    if (!Blogdatanew) {
      getAPIData(`/api/blog`).then((res) => {
        dispatch(GETBLOGDATA(res?.data));
      });
    }
  }, [Blogdatanew, dispatch]);
  const BlogDataFilter = Blogdatanew && Blogdatanew.filter((el) => el.type === "blogMasonary");
  return (
    <section className="masonary-blog-section section-b-space">
      <Container>
        <MasonryCard BlogDataFilter={BlogDataFilter} />
      </Container>
    </section>
  );
};

export default BlogMasonaryContain;

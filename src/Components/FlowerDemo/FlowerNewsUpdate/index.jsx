import { Col, Container, Row } from "reactstrap";
import { OurBlog, OurUpdate } from "@/Constant";
import SectionHeader from "../../Element/SectionHeader";
import FlowerNewsCard from "./FlowerNewsCard";
const FlowerNewsUpdate = ({ bannerData }) => {
    return (
        <section className="section-b-space">
            <Container>
                <Row>
                    <Col xs="12" >
                        <SectionHeader title={OurUpdate} subTitle={OurBlog} />
                    </Col>
                    <FlowerNewsCard bannerData={bannerData} />
                </Row>
            </Container>
        </section>
    )
}
export default FlowerNewsUpdate;
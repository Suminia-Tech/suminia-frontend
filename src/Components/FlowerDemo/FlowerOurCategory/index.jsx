import React from "react";
import { Col, Container, Row } from "reactstrap";
import { OurCategory, OurCollection } from "@/Constant";
import CategoryCard from "./CategoryCard";
import SectionHeader from "@/Layout/Element/SectionHeader";
import OurCategoryTop from "@/Components/Element/OurCategory";
const FlowerOurCategory = ({ categorybanner }) => {
    return (
        <section className="category-section ratio_40">
            <Container fluid={true}>
                <Row >
                    <Col lg="12">
                        <SectionHeader title={OurCategory} subTitle={OurCollection} />
                    </Col>
                </Row>
                <Row className="gy-3">
                    <OurCategoryTop />
                    <Col lg="9" className="col-xxl-10">
                        <CategoryCard categorybanner={categorybanner} />
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
export default FlowerOurCategory;
import DealCard from "./DealCard";
import { Col, Container, Row } from "reactstrap";

const FashionDeal = ({ bannerData }) => {

    return (
        <section className="timer-banner-style-2">
            <Container>
                <Row className="gy-3">
                    <Col lg="12" >
                        <DealCard bannerData={bannerData} />
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
export default FashionDeal
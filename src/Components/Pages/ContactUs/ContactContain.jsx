import { Container, Row } from "reactstrap";
import ContactForm from "./ContactForm";
import ContactSidebar from "./ContactSidebar";

const ContactContain = () => {
  return (
    <section className="contact-section">
      <Container>
        <Row className="g-4">
          <ContactForm />
          <ContactSidebar />
        </Row>
      </Container>
    </section>
  );
};

export default ContactContain;

import { Container, Row } from 'reactstrap';
import OfferCard from './OfferCard';
const VegetableOffer = ({ bannerData }) => {
  const OfferFilter = bannerData.filter((el) => el.subtype === 'fruitsbanner');
  return (
    <section className='ratio_90'>
      <Container>
        <Row>
          <div className='product-wrapper slide-6'>
            <OfferCard OfferFilter={OfferFilter} />
          </div>
        </Row>
      </Container>
    </section>
  );
};
export default VegetableOffer;

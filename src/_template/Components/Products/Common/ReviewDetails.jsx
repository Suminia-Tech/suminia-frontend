import { Row } from 'reactstrap';
import AddComments from './AddComments';
import CustomerComments from './CustomerComments';
import CustomerReview from './CustomerReview';

const ReviewDetails = () => {
  return (
    <Row className='g-4'>
      <CustomerReview />
      <AddComments />
      <CustomerComments />
    </Row>
  );
};

export default ReviewDetails;

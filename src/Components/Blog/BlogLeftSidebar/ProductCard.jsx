import { CommonPath } from '@/Constant';
import Link from 'next/link';
import { Card, CardBody, Col, Row } from 'reactstrap';
import Img from '../../Element/Images';

const ProductCard = ({ currentData }) => {
  return (
    <Row className='g-4'>
      {currentData &&
        currentData.map((elem) => {
          return (
            <Col lg='4' md='6' key={elem.id}>
              <Card className='blog-categority'>
                <Link href={'/blog/blog_details'} className='blog-img'>
                  <Img src={`${CommonPath}/${elem.imagePath}`} alt='blog-thumbnail' className='card-img-topbg-img bg-img' />
                </Link>
                <CardBody>
                  <h5>{elem.title}</h5>
                  <Link href={'/blog/blog_details'}>
                    <h2 className='card-title'>{elem.heading}</h2>
                  </Link>
                  <div className='blog-profile'>
                    <div className='image-name'>
                      <h3>{elem.name}</h3>
                      <h6>{elem.date}</h6>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          );
        })}
    </Row>
  );
};

export default ProductCard;

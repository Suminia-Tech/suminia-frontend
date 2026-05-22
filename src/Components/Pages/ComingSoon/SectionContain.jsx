import { ComingDescription, NotifyMe, Wearecomingsoon } from '@/Constant';
import Link from 'next/link';
import { Col, Form, Input } from 'reactstrap';

const SectionContain = () => {
  return (
    <Col md='8' className='m-auto'>
      <div className='coming-soon-content'>
        <div>
          <h1>{Wearecomingsoon}</h1>
          <p>{ComingDescription}</p>
          <Form>
            <Input className='form-control' placeholder='enter your email address' />
            <Link href={'/'} className='btn btn-solid-default mt-4'>
              {NotifyMe}
            </Link>
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default SectionContain;

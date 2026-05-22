import {
  Address,
  Address2,
  Continuecheckout,
  Emailaddress,
  FirstName,
  LastName,
  SaveInfo,
  Username,
  Zip,
  address2required,
  addressrequired,
  emailrequired,
  firstnamerequired,
  lastnamerequired,
  usernamerequired,
  ziprequired,
} from '@/Constant';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Col, Form, Input, Label, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import CountryField from './CountryField';
import PaymantMode from './PaymantMode';
import StateField from './StateField';

const CheckoutForm = () => {
  const [isFormData, setIsFormData] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setIsFormData(data);
  };

  return (
    <Form className='needs-validation' onSubmit={handleSubmit(onSubmit)}>
      <Row className='g-4'>
        <Col md='6'>
          <Label htmlFor='fname' className='form-label'>
            {FirstName}
          </Label>
          <input type='text' className='form-control' name='firstname' id='fname' placeholder='Enter First Name' {...register('firstname', { required: true })} />
          {errors.firstname && <span style={{ color: 'red' }}>{firstnamerequired}</span>}
        </Col>
        <Col md='6'>
          <Label htmlFor='lname' className='form-label'>
            {LastName}
          </Label>
          <input type='text' className='form-control' name='lastname' id='lname' placeholder='Enter Last Name' {...register('firstname', { required: true })} />
          {errors.lastname && <span style={{ color: 'red' }}>{lastnamerequired}</span>}
        </Col>
        <Col md='6'>
          <Label htmlFor='lname' className='form-label'>
            {Username}
          </Label>
          <div className='input-group'>
            <span className='input-group-text' id='basic-addon1'>
              @
            </span>
            <input type='text' className='form-control' placeholder='Username' name='username' {...register('username', { required: true })} />
          </div>
          {errors.username && <span style={{ color: 'red' }}>{usernamerequired}</span>}
        </Col>

        <Col md='6'>
          <Label htmlFor='email' className='form-label'>
            {Emailaddress}
          </Label>
          <input type='email' className='form-control' id='email' placeholder='example@example.com' name='email' {...register('email', { required: true })} />
          {errors.email && <span style={{ color: 'red' }}>{emailrequired}</span>}
        </Col>

        <Col md='6'>
          <Label htmlFor='address' className='form-label'>
            {Address}
          </Label>
          <input type='text' className='form-control' id='address' placeholder='1234 Main St' name='address' {...register('address', { required: true })} />
          {errors.address && <span style={{ color: 'red' }}>{addressrequired}</span>}
        </Col>

        <Col md='6'>
          <Label htmlFor='address2' className='form-label'>
            {Address2}
          </Label>
          <input type='text' className='form-control' id='address2' placeholder='1234 Main St' name='address2' {...register('address2', { required: true })} />
          {errors.address2 && <span style={{ color: 'red' }}>{address2required}</span>}
        </Col>
        <CountryField />
        <StateField />
        <Col md='3'>
          <Label htmlFor='zip' className='form-label'>
            {Zip}
          </Label>
          <input type='text' className='form-control' id='zip' placeholder='1234 Main St' name='zip' {...register('zip', { required: true })} />
          {errors.zip && <span style={{ color: 'red' }}>{ziprequired}</span>}
        </Col>
      </Row>
      <div className='form-check mt-3 custome-form-check'>
        <Input className='checkbox_animated check-it' type='checkbox' id='flexCheckDefault11' />
        <Label className='form-check-label checkout-label' htmlFor='flexCheckDefault11'>
          {SaveInfo}
        </Label>
      </div>
      <Btn attrBtn={{ className: 'btn btn-solid-default mt-4' }}>{Continuecheckout}</Btn>
      <hr className='my-lg-5 my-4' />
      <PaymantMode isFormData={isFormData} />
    </Form>
  );
};

export default CheckoutForm;

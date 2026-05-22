import Image from 'next/image';
import Link from 'next/link';

export const headDashboardColumn = [
  {
    selector: (row) => row.image,
    name: 'Image',
  },
  {
    selector: (row) => row.order,
    name: 'Order Id',
  },
  {
    selector: (row) => row.product,
    name: 'Product Details',
  },
  {
    selector: (row) => row.status,
    name: 'Status',
  },
  {
    selector: (row) => row.price,
    name: 'Price',
  },
  {
    selector: (row) => row.view,
    name: 'View',
  },
];
export const headDashboardData = [
  {
    image: (
      <Link href={'/product/product_left_sidebar/1'}>
        <Image src='/assets/images/fashion/product/front/1.jpg' alt='fashion' height={70} width={46} />
      </Link>
    ),
    order: <p className='mt-0'>#4545774</p>,
    product: <p className='fs-6 m-0'>{`Men's Sweatshirt`}</p>,
    status: <p className='success-button btn btn-sm'>Shipped</p>,
    price: <p className='theme-color fs-6'>$25.54</p>,
    view: (
      <a href='#javascript'>
        <i className='far fa-eye'></i>
      </a>
    ),
  },
  {
    image: (
      <Link href={'/product/product_left_sidebar/2'}>
        <Image src='/assets/images/fashion/product/front/2.jpg' alt='fashion' height={70} width={46}/>
      </Link>
    ),
    order: <p className='mt-0'>#757545</p>,
    product: <p className='fs-6 m-0'>Outwear & Coats</p>,
    status: <p className='danger-button btn btn-sm'>Pending</p>,
    price: <p className='theme-color fs-6'>$99.54</p>,
    view: (
      <a href='#javascript'>
        <i className='far fa-eye'></i>
      </a>
    ),
  },
  {
    image: (
      <Link href={'/product/product_left_sidebar/3'}>
        <Image src='/assets/images/fashion/product/front/3.jpg' alt='fashion' height={70} width={46}/>
      </Link>
    ),
    order: <p className='mt-0'>#45575</p>,
    product: <p className='fs-6 m-0'>Outwear & Coats</p>,
    status: <p className='success-button btn btn-sm'>Shipped</p>,
    price: <p className='theme-color fs-6'>$56.54</p>,
    view: (
      <a href='#javascript'>
        <i className='far fa-eye'></i>
      </a>
    ),
  },
  {
    image: (
      <Link href={'/product/product_left_sidebar/4'}>
        <Image src='/assets/images/fashion/product/front/4.jpg' alt='fashion' height={70} width={46}/>
      </Link>
    ),
    order: <p className='mt-0'>#754575</p>,
    product: <p className='fs-6 m-0'>{`Men's Hoodie T-Shirt`}</p>,
    status: <p className='danger-button btn btn-sm'>Pending</p>,
    price: <p className='theme-color fs-6'>$69.54</p>,
    view: (
      <a href='#javascript'>
        <i className='far fa-eye'></i>
      </a>
    ),
  },
  {
    image: (
      <Link href={'/product/product_left_sidebar/5'}>
        <Image src='/assets/images/fashion/product/front/5.jpg' alt='fashion' height={70} width={46}/>
      </Link>
    ),
    order: <p className='mt-0'>#55575</p>,
    product: <p className='fs-6 m-0'>{`Men's Sweatshirt`}</p>,
    status: <p className='danger-button btn btn-sm'>Pending</p>,
    price: <p className='theme-color fs-6'>$78.54</p>,
    view: (
      <a href='#javascript'>
        <i className='far fa-eye'></i>
      </a>
    ),
  },
];

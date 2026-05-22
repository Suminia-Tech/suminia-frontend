import Image from 'next/image';
import Link from 'next/link';

export const WishlistColumns = [
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
    selector: (row) => row.price,
    name: 'Price',
  },
  {
    selector: (row) => row.action,
    name: 'ACTION',
  },
];
export const WishlistData = [
  {
    image: (
      <Link href={'/page/wishlist'}>
        <Image src='/assets/images/fashion/product/front/1.jpg' alt='product' height={70} width={46}/>
      </Link>
    ),
    order: <p className='m-0'>#125021</p>,
    product: <p className='fs-6 m-0'>{`Men's Sweatshirt`}</p>,
    price: <p className='theme-color fs-6'>$49.54</p>,
    action: (
      <Link href={'/page/cart'} className='btn btn-solid-default btn-sm fw-bold'>
        Move to Cart
      </Link>
    ),
  },
  {
    image: (
      <Link href={'/page/wishlist'}>
        <Image src='/assets/images/fashion/product/front/2.jpg' alt='product' height={70} width={46}/>
      </Link>
    ),
    order: <p className='m-0'>#125021</p>,
    product: <p className='fs-6 m-0'>Outwear & Coats</p>,
    price: <p className='theme-color fs-6'>$49.54</p>,
    action: (
      <Link href={'/page/cart'} className='btn btn-solid-default btn-sm fw-bold'>
        Move to Cart
      </Link>
    ),
  },
  {
    image: (
      <Link href={'/page/wishlist'}>
        <Image src='/assets/images/fashion/product/front/3.jpg' alt='product' height={70} width={46}/>
      </Link>
    ),
    order: <p className='m-0'>#125021</p>,
    product: <p className='fs-6 m-0'>{`Men's Hoodie T-Shirt`}</p>,
    price: <p className='theme-color fs-6'>$49.54</p>,
    action: (
      <Link href={'/page/cart'} className='btn btn-solid-default btn-sm fw-bold'>
        Move to Cart
      </Link>
    ),
  },
  {
    image: (
      <Link href={'/page/wishlist'}>
        <Image src='/assets/images/fashion/product/front/4.jpg' alt='product' height={70} width={46}/>
      </Link>
    ),
    order: <p className='m-0'>#125021</p>,
    product: <p className='fs-6 m-0'>Outwear & Coats</p>,
    price: <p className='theme-color fs-6'>$49.54</p>,
    action: (
      <Link href={'/page/cart'} className='btn btn-solid-default btn-sm fw-bold'>
        Move to Cart
      </Link>
    ),
  },
  {
    image: (
      <Link href={'/page/wishlist'}>
        <Image src='/assets/images/fashion/product/front/5.jpg' alt='product' height={70} width={46}/>
      </Link>
    ),
    order: <p className='m-0'>#125021</p>,
    product: <p className='fs-6 m-0'>{`Men's Hoodie T-Shirt`}</p>,
    price: <p className='theme-color fs-6'>$49.54</p>,
    action: (
      <Link href={'/page/cart'} className='btn btn-solid-default btn-sm fw-bold'>
        Move to Cart
      </Link>
    ),
  },
  {
    image: (
      <Link href={'/page/wishlist'}>
        <Image src='/assets/images/fashion/product/front/6.jpg' alt='product' height={70} width={46}/>
      </Link>
    ),
    order: <p className='m-0'>#125021</p>,
    product: <p className='fs-6 m-0'>Outwear & Coats</p>,
    price: <p className='theme-color fs-6'>$49.54</p>,
    action: (
      <Link href={'/page/cart'} className='btn btn-solid-default btn-sm fw-bold'>
        Move to Cart
      </Link>
    ),
  },
];

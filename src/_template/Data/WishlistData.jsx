import Image from 'next/image';
import Link from 'next/link';

export const WishlistColumns = [
  { selector: (row) => row.image, name: 'Image' },
  { selector: (row) => row.order, name: 'Order Id' },
  { selector: (row) => row.product, name: 'Product Details' },
  { selector: (row) => row.price, name: 'Price' },
  { selector: (row) => row.action, name: 'ACTION' },
];

const products = [
  { img: '1', name: 'Acetaminofén 500mg x100', price: '$7.65' },
  { img: '2', name: 'Amoxicilina 500mg x21', price: '$12.35' },
  { img: '3', name: 'Vitamina C 1000mg x30', price: '$10.80' },
  { img: '4', name: 'Losartán 50mg x30', price: '$13.50' },
  { img: '5', name: 'Omeprazol 20mg x30', price: '$9.90' },
  { img: '6', name: 'Cetirizina 10mg x30', price: '$8.55' },
];

export const WishlistData = products.map((p, i) => ({
  image: (
    <Link href={'/page/wishlist'}>
      <Image src={`/assets/images/inner-page/product/${p.img}.png`} alt='product' height={70} width={70} />
    </Link>
  ),
  order: <p className='m-0'>{`#12502${i + 1}`}</p>,
  product: <p className='fs-6 m-0'>{p.name}</p>,
  price: <p className='theme-color fs-6'>{p.price}</p>,
  action: (
    <Link href={'/page/cart'} className='btn btn-solid-default btn-sm fw-bold'>
      Agregar al carrito
    </Link>
  ),
}));

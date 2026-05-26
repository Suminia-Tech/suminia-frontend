import Image from 'next/image';
import Link from 'next/link';

export const headDashboardColumn = [
  { selector: (row) => row.image, name: 'Image' },
  { selector: (row) => row.order, name: 'Order Id' },
  { selector: (row) => row.product, name: 'Product Details' },
  { selector: (row) => row.status, name: 'Status' },
  { selector: (row) => row.price, name: 'Price' },
  { selector: (row) => row.view, name: 'View' },
];

const orders = [
  { img: '1', id: 1, order: '#4545774', name: 'Acetaminofén 500mg x100', status: 'Shipped', statusClass: 'success-button', price: '$7.65' },
  { img: '2', id: 2, order: '#757545', name: 'Amoxicilina 500mg x21', status: 'Pendiente', statusClass: 'danger-button', price: '$12.35' },
  { img: '3', id: 3, order: '#45575', name: 'Omeprazol 20mg x30', status: 'Shipped', statusClass: 'success-button', price: '$9.90' },
  { img: '4', id: 4, order: '#754575', name: 'Losartán 50mg x30', status: 'Pendiente', statusClass: 'danger-button', price: '$13.50' },
  { img: '5', id: 5, order: '#55575', name: 'Vitamina C 1000mg x30', status: 'Pendiente', statusClass: 'danger-button', price: '$10.80' },
];

export const headDashboardData = orders.map((o) => ({
  image: (
    <Link href={`/product/product_left_thumbnail/${o.id}`}>
      <Image src={`/assets/images/inner-page/product/${o.img}.png`} alt='producto' height={70} width={70} />
    </Link>
  ),
  order: <p className='mt-0'>{o.order}</p>,
  product: <p className='fs-6 m-0'>{o.name}</p>,
  status: <p className={`${o.statusClass} btn btn-sm`}>{o.status}</p>,
  price: <p className='theme-color fs-6'>{o.price}</p>,
  view: (
    <a href='#javascript'>
      <i className='far fa-eye'></i>
    </a>
  ),
}));

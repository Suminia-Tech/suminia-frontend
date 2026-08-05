export const orderHeadColumn = [
  {
    name: 'Date',
    selector: (row) => row.date,
  },
  {
    name: 'Time',
    selector: (row) => row.time,
  },
  {
    name: 'Discription',
    selector: (row) => row.discription,
  },
  {
    name: 'Loaction',
    selector: (row) => row.loaction,
  },
];
export const orderHeadData = [
  {
    date: '21/05/2022',
    time: '12:21 AM',
    discription: 'Shipped Info',
    loaction: '3 SW. Summit St. Lithonia, GA 30038',
  },
  {
    date: '15/04/2022',
    time: '01:00 PM',
    discription: 'Shipped',
    loaction: '70 Rockwell Lane Falls Church, VA 22041',
  },
  {
    date: '04/05/2022',
    time: '03:58 AM',
    discription: 'Shipped Info Received',
    loaction: '3 SW. Summit St. Lithonia, GA 30038',
  },
  {
    date: '30/04/2022',
    time: '06:26 PM',
    discription: 'Origin Scan',
    loaction: '38 Saxon Lane Mobile, AL 36605',
  },
  {
    date: '21/05/2022',
    time: '12:21 AM',
    discription: 'Shipped Info',
    loaction: '3 SW. Summit St. Lithonia, GA 30038',
  },
  {
    date: '15/04/2022',
    time: '01:00 PM',
    discription: 'Shipped',
    loaction: '70 Rockwell Lane Falls Church, VA 22041',
  },
];

export const ProductDetails = [
  {
    id: 1,
    classs: 'progtrckr-done',
    title: 'Order Processing',
    duration: '05:43 AM',
  },
  {
    id: 2,
    classs: 'progtrckr-done',
    title: 'Pre-Production',
    duration: '01:21 PM',
  },
  {
    id: 3,
    classs: 'progtrckr-done',
    title: 'In Production',
    duration: 'Processing',
  },
  {
    id: 4,
    classs: 'progtrckr-todo',
    title: 'Shipped',
    duration: 'Pending',
  },
  {
    id: 5,
    classs: 'progtrckr-todo',
    title: 'Delivered',
    duration: 'Pending',
  },
];

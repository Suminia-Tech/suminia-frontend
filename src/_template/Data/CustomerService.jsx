import { CustomerSvg, PaymentSvg, ReturnSvg, StoreSvg } from "./SVG";

export const CustomerService = [
    {
        id: 1,
        svg: <CustomerSvg />,
        title: 'Customer Servcies',
        subtitle: 'Top notch customer service.'
    },
    {
        id: 2,
        svg: <StoreSvg />,
        title: 'Pickup At Any Store',
        subtitle: 'Free shipping on orders over $65.'
    },
    {
        id: 3,
        svg: <PaymentSvg />,
        title: 'Secured Payment',
        subtitle: 'We accept all major credit cards.'
    },
    {
        id: 4,
        svg: <ReturnSvg />,
        title: 'Free Returns',
        subtitle: '30-days free return policy.'
    },
]
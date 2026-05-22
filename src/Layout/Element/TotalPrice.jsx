import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Btn } from '@/Components/AbstractElements';
import { ProceedTOPayment, Total } from '@/Constant';
const TotalPrice = ({ getTotalPrice }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  const router = useRouter();
  const redirectTo = () => {
    router.push('/page/cart');
  };
  return (
    <div className='cart-btn'>
      <h6 className='cart-total'>
        <span className='font-light'>{Total}:</span> {symbol} {(getTotalPrice() * currencyValue).toFixed(2)}
      </h6>
      <Btn
        attrBtn={{
          className: 'btn-solid-default btn-block',
          onClick: () => redirectTo(),
        }}>
        {ProceedTOPayment}
      </Btn>
    </div>
  );
};
export default TotalPrice;

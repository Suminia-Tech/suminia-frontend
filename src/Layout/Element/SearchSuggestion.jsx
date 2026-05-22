import { CommonPath } from '@/Constant';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Media } from 'reactstrap';
import DynamicRating from '../../Components/Element/DynamicRating';
import NoProductFound from './NoProductFound';

const SearchSuggestion = ({ FilteredData, Is_Focus }) => {
  const router = useRouter();
  const getProductDetail = (value) => {
    router.push(`/product/product_left_sidebar/${value.id}`);
  };
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <>
      {FilteredData?.length != 53 ? (
        <>
          {FilteredData?.length > 0 ? (
            <div className='search-suggestion search-suggestion-2'>
              <ul className='custom-scroll'>
                {FilteredData.map((elem) => {
                  return (
                    <Fragment key={elem.id}>
                      {elem.category !== 'vr' && (
                        <>
                          {Is_Focus && (
                            <li>
                              <Media className='product-cart'>
                                <div className='media-image'>
                                  {elem?.images.slice(0, 1).map((img, i) => (
                                    <Image width={100} height={100} src={`${CommonPath}/${img.src}`} className='img-fluid' alt='demo-image' key={i} />
                                  ))}
                                </div>
                                <Media body>
                                  <a onClick={() => getProductDetail(elem)}>
                                    <h6 className='mb-1'>{elem.name}</h6>
                                  </a>
                                  <DynamicRating data={elem.ratingStars} customeclass={'p-0'} />
                                  <p className='mb-0 mt-1'>
                                    {symbol} {(elem.price * currencyValue).toFixed(2)}
                                  </p>
                                </Media>
                              </Media>
                            </li>
                          )}
                        </>
                      )}
                    </Fragment>
                  );
                })}
              </ul>
            </div>
          ) : (
            <NoProductFound />
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default SearchSuggestion;

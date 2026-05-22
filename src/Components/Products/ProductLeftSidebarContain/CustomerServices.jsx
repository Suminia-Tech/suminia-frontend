import { CustomerServcies, daysfreepolicy, FreeReturns, Freeshipping65, PickupStore, SecuredPayment, Topservice, Wecards } from '@/Constant';

const CustomerServices = () => {
  return (
    <div className='accordion-item service-accorion'>
      <div id='collapseFour' className='accordion-collapse collapse show' data-bs-parent='#accordionExample'>
        <div className='accordion-body'>
          <ul className='category-list'>
            <li>
              <div className='service-wrap'>
                <div className='service-icon'>
                  <svg>
                    <use xlinkHref='/assets/svg/icons.svg#customer'></use>
                  </svg>
                </div>
                <div className='service-content'>
                  <h3>{CustomerServcies}</h3>
                  <span className='font-light'>{Topservice}</span>
                </div>
              </div>
            </li>

            <li>
              <div className='service-wrap'>
                <div className='service-icon'>
                  <svg>
                    <use xlinkHref='/assets/svg/icons.svg#shop'></use>
                  </svg>
                </div>
                <div className='service-content'>
                  <h3>{PickupStore}</h3>
                  <span className='font-light'>{Freeshipping65}</span>
                </div>
              </div>
            </li>

            <li>
              <div className='service-wrap'>
                <div className='service-icon'>
                  <svg>
                    <use xlinkHref='/assets/svg/icons.svg#secure-payment'></use>
                  </svg>
                </div>
                <div className='service-content'>
                  <h3>{SecuredPayment}</h3>
                  <span className='font-light'>{Wecards}</span>
                </div>
              </div>
            </li>

            <li>
              <div className='service-wrap'>
                <div className='service-icon'>
                  <svg>
                    <use xlinkHref='/assets/svg/icons.svg#return'></use>
                  </svg>
                </div>
                <div className='service-content'>
                  <h3>{FreeReturns}</h3>
                  <span className='font-light'>{daysfreepolicy}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerServices;

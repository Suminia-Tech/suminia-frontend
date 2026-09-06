import { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import TopHeaderCurrency from './TopHeaderCurrency';
import TopLanguage from './TopLanguage';

const TopHeaderBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='top-header'>
      <div className='container-fluid-lg'>
        <Row>
          <div className='col-auto d-xl-block d-none'>
            <ul className='border-list p-0'>
              <li className='me-0'>Voxo ecommerce always free delivery</li>
              <li>New Customer Extra 50% Off</li>
            </ul>
          </div>
          <div className='col-auto d-sm-block d-none'>
            <p className='font-dark-30 mb-0'>
              Offer Coupon Code : <span className='fw-bold'>DEF4526</span>
            </p>
          </div>
          <div className='col-auto'>
            <ul className='border-list p-0'>
              <li>
                <Dropdown className='top-header-dropdown' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
                  <DropdownToggle>
                    <span>Login & Register</span>
                    <i className='fas fa-chevron-down'></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>Log In</DropdownItem>
                    <DropdownItem>Register</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
              <TopHeaderCurrency />
              <TopLanguage />
            </ul>
          </div>
        </Row>
      </div>
    </div>
  );
};
export default TopHeaderBar;

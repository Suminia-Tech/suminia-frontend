import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import TopHeaderCurrency from './TopHeaderCurrency';
import TopLanguage from './TopLanguage';
const TopHeaderBar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='top-header top-header-black'>
      <div className='container-fluid-lg'>
        <Row>
          <div className='col-auto d-xl-block d-none'>
            <ul className='border-list'>
              <li>Voxo ecommerce always free delivery</li>
              <li>New Customer Extra 50% Off</li>
            </ul>
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
export default TopHeaderBar2;

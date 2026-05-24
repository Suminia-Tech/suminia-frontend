import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
const TopHeaderBar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='top-header top-header-black'>
      <div className='container-fluid-lg'>
        <Row className='justify-content-end'>
          <div className='col-auto'>
            <ul className='border-list p-0'>
              <li>
                <Dropdown className='top-header-dropdown' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
                  <DropdownToggle>
                    <span>Iniciar sesión</span>
                    <i className='fas fa-chevron-down'></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>Iniciar sesión</DropdownItem>
                    <DropdownItem>Registrarse</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </Row>
      </div>
    </div>
  );
};
export default TopHeaderBar2;

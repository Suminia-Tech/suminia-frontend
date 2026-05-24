import { useState } from 'react';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { useHeaderScroll } from '@/Utils/HeaderScroll';
import HeadingLogo from '@/Layout/Element/HeadingLogo';
import AllCategories from '@/Layout/Element/AllCategories';
import SearchForVegitable from '@/Layout/Element/SearchForVegitable';
import ThreeBarToggle from '@/Layout/Element/ThreeBarToggle';
import SearchBarWithBgColor from '@/Layout/Element/SearchBarWithBgColor';
import ItemCart from '@/Layout/Element/ItemCart';
import SearchBarToggle from '@/Layout/Element/SearchBarToggle';
import NavBar from '@/Layout/Element/NavBar';

const Header5 = ({ noStyle, isCategories }) => {
  const UpScroll = useHeaderScroll(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header id='home' className={`${!noStyle ? `${UpScroll ? 'nav-down nav-up' : ''}` : ''}`}>
      <div className='main-header search-header navbar-searchbar'>
        <div className='container-fluid-lg'>
          <Row>
            <Col lg='12'>
              <div className='main-menu'>
                <div className='menu-left'>
                  <HeadingLogo />
                  <AllCategories isCategories={isCategories} />
                </div>
                <SearchForVegitable />
                <div className='menu-right'>
                  <ul>
                    <li>
                      <ThreeBarToggle />
                    </li>
                    <SearchBarWithBgColor customeClass={'d-lg-none d-block'} />
                    <ItemCart />
                  </ul>
                </div>
                <SearchBarToggle />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className='main-header'>
        <div className='container-fluid-lg'>
          <Row>
            <Col lg='12'>
              <div className='main-menu'>
                <nav>
                  <NavBar />
                </nav>
                <div className='menu-right'>
                  <ul>
                    <li>
                      <Dropdown className='top-header-dropdown' isOpen={loginOpen} toggle={() => setLoginOpen(!loginOpen)}>
                        <DropdownToggle tag='a' href='#javascript' className='nav-link menu-title' style={{ cursor: 'pointer' }}>
                          <span>Iniciar Sesión</span>
                          <i className='fas fa-chevron-down ms-1'></i>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <DropdownItem href='/page/login'>Iniciar sesión</DropdownItem>
                          <DropdownItem href='/page/register'>Registrarse</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};
export default Header5;

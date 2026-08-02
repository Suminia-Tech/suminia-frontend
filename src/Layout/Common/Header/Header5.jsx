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
import { useAuth } from '@/hooks/useAuth';
import { getAccountLabel } from '@/Utils/roleLabel';
import { LOGINMODAL } from '@/ReduxToolkit/Reducers/ModalReducer';
import { useDispatch } from 'react-redux';

const Header5 = ({ noStyle, isCategories }) => {
  const UpScroll = useHeaderScroll(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logout();
    setLoginOpen(false);
  };

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
                      {isAuthenticated ? (
                        <Dropdown className='top-header-dropdown' isOpen={loginOpen} toggle={() => setLoginOpen(!loginOpen)}>
                          <DropdownToggle tag='a' href='#javascript' className='nav-link menu-title' style={{ cursor: 'pointer' }}>
                            <span>{user?.name}</span>
                            <i className='fas fa-chevron-down ms-1'></i>
                          </DropdownToggle>
                          <DropdownMenu end>
                            <DropdownItem href='/page/user_dashboard'>{getAccountLabel(user)}</DropdownItem>
                            <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        <a className='nav-link menu-title' style={{ cursor: 'pointer' }} onClick={() => dispatch(LOGINMODAL())}>
                          <span>Iniciar Sesión</span>
                        </a>
                      )}
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

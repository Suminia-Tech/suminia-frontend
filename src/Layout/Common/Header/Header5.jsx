import { Col, Row } from 'reactstrap';
import { useHeaderScroll } from '@/Utils/HeaderScroll';
import TopHeaderBar2 from '@/Layout/Element/TopHeaderBar2';
import HeadingLogo from '@/Layout/Element/HeadingLogo';
import AllCategories from '@/Layout/Element/AllCategories';
import SearchForVegitable from '@/Layout/Element/SearchForVegitable';
import ThreeBarToggle from '@/Layout/Element/ThreeBarToggle';
import SearchBarWithBgColor from '@/Layout/Element/SearchBarWithBgColor';
import { RefreshCw } from 'react-feather';
import ItemCart from '@/Layout/Element/ItemCart';
import SearchBarToggle from '@/Layout/Element/SearchBarToggle';
import WishList from '@/Layout/Element/WishList';
import NavBar from '@/Layout/Element/NavBar';

const Header5 = ({ noStyle, isCategories }) => {
  const UpScroll = useHeaderScroll(false);
  return (
    <header id='home' className={`${!noStyle ? `${UpScroll ? 'nav-down nav-up' : ''}` : ''}`}>
      <TopHeaderBar2 />
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
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};
export default Header5;

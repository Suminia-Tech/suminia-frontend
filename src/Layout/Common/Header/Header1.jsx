import HeadingLogo from '@/Layout/Element/HeadingLogo';
import { useHeaderScroll } from '@/Utils/HeaderScroll';
import { Col, Row } from 'reactstrap';
import NavBar from '@/Layout/Element/NavBar';
import RightHeader from '@/Layout/Element/RightHeader';
import SearchBarToggle from '@/Layout/Element/SearchBarToggle';
import AllCategories from '../../Element/AllCategories';
import Overlay from '@/Layout/Overlay';
const Header1 = ({ noStyle }) => {
  const UpScroll = useHeaderScroll(false);
  return (
    <header className={`${!noStyle ? `header-style-2 ${UpScroll ? 'nav-down nav-up' : ''}` : 'header-style-2'}`} id='home'>
      <div className='main-header navbar-searchbar'>
        <div className='container-fluid-lg'>
          <Row>
            <Col lg='12'>
              <div className='main-menu'>
                <div className='menu-left d-block'>
                  <HeadingLogo />
                  <AllCategories />
                </div>
                <nav>
                  <Overlay />
                  <NavBar />
                </nav>
                <RightHeader />
                <SearchBarToggle />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};
export default Header1;

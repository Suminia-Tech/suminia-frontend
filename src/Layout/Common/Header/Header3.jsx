import { Col, Row } from 'reactstrap';
import { useHeaderScroll } from '@/Utils/HeaderScroll';
import AllCategories from '../../Element/AllCategories';
import HeadingLogo from '../../Element/HeadingLogo';
import NavBar from '../../Element/NavBar';
import RightHeaderDifferent from '../../Element/RightHeaderDifferent';
import SearchBarToggle from '../../Element/SearchBarToggle';
const Header3 = ({ noStyle }) => {
  const UpScroll = useHeaderScroll(false);
  return (
    <header className={`${!noStyle ? (UpScroll ? 'nav-down nav-up' : '') : ''} header-style-2 header-style-4`} id='home'>
      <div className='main-header navbar-searchbar'>
        <div className='container-fluid-lg'>
          <Row>
            <Col lg='12'>
              <div className='main-menu'>
                <div className='menu-left'>
                  <HeadingLogo />
                  <AllCategories />
                </div>
                <nav>
                  <NavBar />
                </nav>
                <RightHeaderDifferent />
                <SearchBarToggle />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};
export default Header3;

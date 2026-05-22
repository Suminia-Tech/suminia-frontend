import Cookie1 from './Common/Cookie/Cookie1';
import ThemeCustomizer from './Common/Customizer';
import Footers from './Common/Footer';
import Header3 from './Common/Header/Header3';
import StarterLoader from './Common/Loader';
import TapTop from './Common/TapTop';

const Layout3 = ({ children }) => {
  return (
    <>
      <StarterLoader />
      <Header3 />
      {children}
      <ThemeCustomizer />
      <Cookie1 />
      <TapTop />
      <Footers />
    </>
  );
};

export default Layout3;

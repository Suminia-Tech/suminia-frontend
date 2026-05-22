import Cookie from "./Common/Cookie";
import TapTop from "./Common/TapTop";
import Footers from "./Common/Footer";
import StarterLoader from './Common/Loader';
import ThemeCustomizer from "./Common/Customizer";
import Header1 from "./Common/Header/Header1";

const Layout1 = ({ children, isCookie }) => {
  return (
    <>
      <Header1 />
      {children}
      <ThemeCustomizer />
      {isCookie === "/layout/fashion" || isCookie === "/" ? <Cookie /> : false}
      <TapTop />
      <Footers />
      <StarterLoader />
    </>
  );
};
export default Layout1;

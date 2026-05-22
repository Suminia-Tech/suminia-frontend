import Cookie1 from "./Common/Cookie/Cookie1";
import ThemeCustomizer from "./Common/Customizer";
import Footers from "./Common/Footer";
import Header5 from "./Common/Header/Header5";
import StarterLoader from "./Common/Loader";
import TapTop from "./Common/TapTop";
const Layout6 = ({ children, isCategories }) => {
  const QuestionTab = true;
  return (
    <>
      <StarterLoader />
      <Header5 isCategories={isCategories} />
      {children}
      <ThemeCustomizer />
      <Cookie1 />
      <TapTop />
      <Footers QuestionTab={QuestionTab} />
    </>
  );
};
export default Layout6;

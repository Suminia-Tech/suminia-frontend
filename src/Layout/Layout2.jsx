import Cookie1 from "./Common/Cookie/Cookie1";
import ThemeCustomizer from "./Common/Customizer";
import Footers from "./Common/Footer";
import Header2 from "./Common/Header/Header2";
import TapTop from "./Common/TapTop";
import StarterLoader from "./Common/Loader";

const Layout2 = ({ children, isCategories, customClass }) => {
  const QuestionTab = true;
  const icon = true;
  return (
    <>
      <StarterLoader />
      <Header2 isCategories={isCategories} icon={icon} customClass={customClass} />
      {children}
      <Cookie1 />
      <ThemeCustomizer />
      <TapTop />
      <Footers QuestionTab={QuestionTab} />
    </>
  );
};
export default Layout2;

import React from 'react';
import Cookie from './Common/Cookie';
import ThemeCustomizer from './Common/Customizer';
import Footers from './Common/Footer';
import Header4 from './Common/Header/Header4';
import StarterLoader from './Common/Loader';
import TapTop from './Common/TapTop';

const Layout5 = ({ children, isCategories }) => {
  const QuestionTab = true;
  return (
    <>
      <StarterLoader />
      <Header4 isCategories={isCategories} />
      {children}
      <ThemeCustomizer />
      <Cookie />
      <TapTop />
      <Footers QuestionTab={QuestionTab} />
    </>
  );
};
export default Layout5;

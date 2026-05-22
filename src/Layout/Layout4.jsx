import React from 'react';
import Cookie from './Common/Cookie';
import ThemeCustomizer from './Common/Customizer';
import Footers from './Common/Footer';
import Header4 from './Common/Header/Header4';
import StarterLoader from './Common/Loader';
import TapTop from './Common/TapTop';
const Layout4 = ({ children, isCategories }) => {
  const addLeft = true;
  return (
    <>
      <StarterLoader />
      <Header4 isCategories={isCategories} />
      {children}
      <ThemeCustomizer />
      <Cookie addLeft={addLeft} />
      <TapTop />
      <Footers />
    </>
  );
};
export default Layout4;

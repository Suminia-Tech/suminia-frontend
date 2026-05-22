import { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import TabpanSection from './TabpanSection';

const NavTabHead = ({ TabFilter }) => {
  const [activeTab, setActiveTab] = useState(3);
  const [num, setNum] = useState(3);
  const [val, setVal] = useState('Mixer');
  const toggle = (tab, elem) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    } else {
      setActiveTab(3);
    }
    setNum(tab);
    setVal(elem.name);
  };
  return (
    <>
      <Nav className="nav-tabs" id="myTab">
        {TabFilter?.map((el) => {
          return el.tabs.map((elem, i) => {
            return (
              <NavItem key={i}>
                <NavLink
                  href="#javascript"
                  className={`${activeTab === i ? 'active show' : ''}`}
                  onClick={() => toggle(i, elem)}
                >
                  {elem.name}
                </NavLink>
              </NavItem>
            );
          });
        })}
      </Nav>
      <TabpanSection
        activeTab={activeTab}
        TabFilter={TabFilter}
        num={num}
        val={val}
      />
    </>
  );
};

export default NavTabHead;

import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row } from "reactstrap";
import { Menu, VoxoPlus } from "@/Constant";
import useWindowDimensions from "@/Utils/useWindowDimensions";
import AddToHome from "./AddToHome";
import ThreeBarToggle from "./ThreeBarToggle";
import { getAPIData } from "@/Utils";
import { OVERLAY, TOPMENUTOGGLE } from "@/ReduxToolkit/Reducers/ModalReducer";

const NavBar = ({ customClass }) => {
  const { t } = useTranslation("common");
  const { width } = useWindowDimensions();
  const [headerData, setHeaderData] = useState([]);
  const [check, setCheck] = useState("");
  const [childMenuActive, setChildMenuActive] = useState();
  const { overlay, TopMenuToggle } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    getAPIData("/api/header").then((res) => setHeaderData(res?.data));
  }, []);
  const handleClick = () => {
    dispatch(TOPMENUTOGGLE);
    dispatch(OVERLAY);
  };
  return (
    <div className="main-navbar">
      <div id="mainnav">
        <ThreeBarToggle customClass={customClass} />
        <ul className="nav-menu" style={{ right: TopMenuToggle ? "0px" : "-410px" }}>
          <li className="back-btn d-xl-none" onClick={() => handleClick(false)}>
            <div className="close-btn">
              {Menu}
              <span className="mobile-back">
                <i className="fa fa-angle-left"></i>
              </span>
            </div>
          </li>
          {headerData?.map((menu, i) => {
            return (
              <li className={`${menu.title === "VOXO PLUS" ? "mega-menu ratio_40 " : menu.title === "HOME" ? "mega-menu home-menu " : ""}dropdown`} key={i}>
                {menu.title === "VOXO PLUS" ? (
                  <a href="#javascript" className="nav-link menu-title" onClick={() => setCheck(menu.title !== check && menu.title)}>
                    <div className="gradient-title">{t(VoxoPlus)}</div>
                    {overlay && <span className="according-menu">{menu.title === check ? "-" : "+"}</span>}
                  </a>
                ) : (
                  <a href="#javascript" className="nav-link menu-title" onClick={() => setCheck(menu.title !== check && menu.title)}>
                    {t(menu.title)}
                    {overlay && <span className="according-menu">{menu.title === check ? "-" : "+"}</span>}
                  </a>
                )}
                {menu.title === "HOME" ? (
                  <div
                    className="mega-menu-container menu-content"
                    style={{
                      display: overlay ? (menu.title === check ? "block" : "none") : "",
                    }}
                  >
                    <Container fluid={true}>
                      <Row>
                        {menu.children.map((child, i) => {
                          return (
                            <div className="col mega-box" key={i}>
                              <div className="link-section">
                                <div className="opensubmegamenu">
                                  <ul>
                                    <li>
                                      <Link
                                        href={child?.path}
                                        className="megamenu-image d-block"
                                        onClick={() => {
                                          width < 1200 && dispatch(OVERLAY);
                                          dispatch(TOPMENUTOGGLE);
                                        }}
                                      >
                                        <picture>
                                          <img src={`/assets/images/demo-image/${child?.imagePath}`} className="img-fluid" alt="demo-image" />
                                        </picture>
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <div className="megamenu-image-title pb-0">
                                  <h5 className="mb-0">{child.title}</h5>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </Row>
                    </Container>
                  </div>
                ) : menu.title === "VOXO PLUS" ? (
                  <div
                    className="mega-menu-container poster-bg-image menu-content"
                    style={{
                      display: overlay ? (check === menu.title ? "block" : "none") : "",
                    }}
                  >
                    <Container fluid={true}>
                      <Row className="row-cols-5">
                        {menu.children.map((lines, i) => {
                          return (
                            <div className="col mega-box" key={i}>
                              {lines.rows.map((rowEl, i) => {
                                return (
                                  <div className="link-section" key={i}>
                                    <div className="submenu-title" onClick={() => setChildMenuActive(rowEl.title !== childMenuActive && rowEl.title)}>
                                      <h5>
                                        {rowEl.title}
                                        {overlay && <span className="according-menu">{rowEl.title === childMenuActive ? "-" : "+"}</span>}
                                      </h5>
                                    </div>
                                    <div className="submenu-content opensubmegamenu">
                                      <ul className={`list d-xl-block ${rowEl.title === childMenuActive ? "d-block" : "d-none"}`}>
                                        {rowEl?.children.map((subChild, i) => {
                                          return (
                                            <li key={i}>
                                              <Link
                                                href={subChild.path}
                                                onClick={() => {
                                                  width < 1200 && dispatch(OVERLAY);
                                                  dispatch(TOPMENUTOGGLE);
                                                }}
                                              >
                                                {subChild.title}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </Row>
                    </Container>
                  </div>
                ) : (
                  <ul
                    className="nav-submenu menu-content"
                    style={{
                      display: overlay ? (check === menu.title ? "block" : "none") : "",
                    }}
                  >
                    {menu?.children.map((result, i) => {
                      return (
                        <Fragment key={i}>
                          {result.path && (
                            <li>
                              <Link
                                href={`${result?.path}`}
                                onClick={() => {
                                  width < 1200 && dispatch(OVERLAY());
                                  dispatch(TOPMENUTOGGLE());
                                }}
                              >
                                {result?.title}
                                {result?.badge && <span>{result?.badge}</span>}
                              </Link>
                            </li>
                          )}
                        </Fragment>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
          <AddToHome />
        </ul>
      </div>
    </div>
  );
};
export default NavBar;

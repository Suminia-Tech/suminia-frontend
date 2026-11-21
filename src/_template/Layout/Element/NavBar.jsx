import { useTranslation } from "next-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Package, ShoppingBag, User } from "react-feather";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row } from "reactstrap";
import { Menu, VoxoPlus } from "@/_template/Constant";
import useWindowDimensions from "@/_template/Utils/useWindowDimensions";
import AddToHome from "./AddToHome";
import ThreeBarToggle from "./ThreeBarToggle";
import { OVERLAY, TOPMENUTOGGLE } from "@/_template/ReduxToolkit/Reducers/ModalReducer";
import { getAccountPath, getUserArea, useAuth } from "@/modules/auth";
import { useMounted } from "@/shared/hooks/useMounted";

/* El menu de la tienda, escrito aqui. Antes se pedia a una ruta falsa de la
   plantilla (/api/header) cada vez que el encabezado se montaba, y hasta que
   respondia la barra quedaba vacia: al entrar al blog, que monta su propio
   encabezado, el menu desaparecia unos segundos y volvia. Escrito aqui se
   pinta completo desde el primer instante. */
const MENU = [
  { title: "Inicio", path: "/", type: "link" },
  { title: "Productos", path: "/catalog", type: "link" },
  { title: "Blog", path: "/blog/blog_details?id=0", type: "link" },
];

const NavBar = ({ customClass }) => {
  const { t } = useTranslation("common");
  const { width } = useWindowDimensions();
  const headerData = MENU;
  const [check, setCheck] = useState("");
  const [childMenuActive, setChildMenuActive] = useState();
  const { overlay, TopMenuToggle } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  /* La cuenta va en esta barra y no solo en el desplegable de la esquina: es
     donde el comprador la busca, junto a los productos y el blog. Solo aparece con sesion
     iniciada, que es cuando lleva a algun sitio. */
  const { user, isAuthenticated: conSesion } = useAuth();
  /* El servidor no ve la sesion: hasta hidratar, el menu es el del visitante
     en las dos partes. Ver useMounted. */
  const mounted = useMounted();
  const isAuthenticated = mounted && conSesion;
  const accountPath = getAccountPath(user);
  /* El orden sigue el recorrido del comprador y lo que mas usa: PRODUCTOS para
     comprar y MIS PEDIDOS, justo despues, para seguir lo comprado. BLOG, que
     se lee de vez en cuando, en medio. MI CUENTA al final, donde se espera
     encontrarla: son ajustes que se tocan poco. Los pedidos solo los tiene
     el comprador; el proveedor y el personal los ven en su panel. */
  const menuItems = isAuthenticated && getUserArea(user) === "buyer"
    ? (headerData ?? []).flatMap((menu) =>
        menu.path === "/catalog" ? [menu, { title: "Mis pedidos", path: "/buyer/orders", type: "link" }] : [menu],
      )
    : headerData;
  /* Cada pestaña con su icono y la de la pagina actual marcada: en mayusculas
     y sin mas, las cinco se leian como un renglon de texto y no como el menu
     de la tienda. */
  const pathname = usePathname() ?? "";
  const ICONOS = { "/": Home, "/catalog": ShoppingBag, "/buyer/orders": Package };
  const iconoDe = (path) => ICONOS[path] ?? (path.startsWith("/blog") ? BookOpen : null);
  /* Inicio solo en la portada; las demas, en su seccion y lo que cuelga de
     ella (el blog, en cualquiera de sus entradas). */
  const activa = (path) => {
    const base = path.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname.startsWith(base.startsWith("/blog") ? "/blog" : base);
  };
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
          {menuItems?.map((menu, i) => {
            return (
              <li className={`${menu.type === "link" ? "" : menu.title === "VOXO PLUS" ? "mega-menu ratio_40 dropdown" : "dropdown"}`} key={i}>
                {menu.type === "link" ? (
                  <Link
                    href={menu.path}
                    className={`nav-link menu-title store-nav-link${activa(menu.path) ? " is-active" : ""}`}
                    aria-current={activa(menu.path) ? "page" : undefined}
                  >
                    {(() => {
                      const Icono = iconoDe(menu.path);
                      return Icono ? <Icono size={16} /> : null;
                    })()}
                    <span>{menu.title}</span>
                  </Link>
                ) : menu.title === "VOXO PLUS" ? (
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
                {menu.type === "link" ? null : menu.title === "VOXO PLUS" ? (
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
          {isAuthenticated && accountPath && (
            <li>
              <Link
                href={accountPath}
                className={`nav-link menu-title store-nav-link${pathname.startsWith(accountPath) ? " is-active" : ""}`}
                aria-current={pathname.startsWith(accountPath) ? "page" : undefined}
              >
                <User size={16} />
                <span>Mi cuenta</span>
              </Link>
            </li>
          )}
          <AddToHome />
        </ul>
      </div>
    </div>
  );
};
export default NavBar;

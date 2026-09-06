import Link from "next/link";
import { useState } from "react";
import { Col } from "reactstrap";

const MenuFooter = ({ getFooter }) => {
  const [isActive, setIsActive] = useState("0");
  const onHandleChange = (id) => setIsActive(id);

  return (
    <>
      {getFooter.map((elem, id) => {
        return (
          <Col xl="2" lg="3" md="4" sm="6" key={id}>
            <div className="footer-links">
              <div className="footer-title" onClick={() => onHandleChange(id)}>
                <h3>{elem.title}</h3>
              </div>
              <div className={`footer-content d-sm-block ${isActive == id ? "d-block" : " d-none"}`}>
                <ul>
                  {elem.subMenu?.map((menu) => {
                    return (
                      <li key={menu.id}>
                        <Link href={menu.url} className="font-dark">
                          {menu.menu}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Col>
        );
      })}
    </>
  );
};
export default MenuFooter;

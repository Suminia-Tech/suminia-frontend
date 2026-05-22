import { CommonPath } from "@/Constant";
import { Row } from "reactstrap";
import Img from "../../../Element/Images";

const GridsCard = ({ portfoliodata, val, colclass }) => {
  return (
    <Row className="g-3 filter-gallery mt-3 content grid ratio_square">
      {portfoliodata &&
        portfoliodata.map((el) => {
          return el.children
            .filter((ee) => {
              if (val === "all" || val === undefined) return true;
              else return ee.filter === val;
            })
            .map((elem) => {
              return (
                <div className={`grid-item app ${colclass}`} key={elem.id}>
                  <div className="-container parent-container-size">
                    <a>
                      <Img src={`${CommonPath}/${elem.src}`} className="img-fluid bg-img images" alt="parent" />
                      <div className="overlay-color">
                        <div className="overlay-icon">
                          <div>
                            <h3>{elem.title}</h3>
                            <p className="font-light">{elem.description}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              );
            });
        })}
    </Row>
  );
};

export default GridsCard;

import { Input, Label } from "reactstrap";
const KGForVegetable = () => {
  return (
    <ul className="price mt-3">
      <li>
        <div className="form-check mb-3">
          <div className="form-check ps-0">
            <Input className="checkbox_animated check-it" type="checkbox" id="flexCheckDefault" />
            <Label className="form-check-label fw-bold" for="flexCheckDefault">
              1KG
            </Label>
            <span className="ms-2">
              $65.54 <del className="font-light mx-2">$58.31</del>
              <span className="theme-color">20% OFF</span>
            </span>
          </div>
        </div>
      </li>
      <li>
        <div className="form-check">
          <div className="form-check ps-0">
            <Input className="checkbox_animated check-it" type="checkbox" id="flexCheckDefault1" />
            <Label className="form-check-label fw-bold" for="flexCheckDefault1">
              2KG
            </Label>
            <span className="ms-2">
              $68.54 <del className="font-light mx-2">$58.31</del>
              <span className="theme-color">20% OFF</span>
            </span>
          </div>
        </div>
      </li>
    </ul>
  );
};
export default KGForVegetable;

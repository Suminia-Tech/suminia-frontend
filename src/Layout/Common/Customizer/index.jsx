import { Copy } from "react-feather";
import { useDispatch } from "react-redux";
import ColorSelect from "./ColorSelect";
import DarkLight from "./DarkLight";
import Direction from "./Direction";
import Link from "next/link";
import { Button } from "reactstrap";
import { CONFIGMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";

const ThemeCustomizer = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="theme-setting">
        <ul>
          <li className="copy-box" onClick={() => dispatch(CONFIGMODAL())}>
            <Copy />
          </li>
          <DarkLight />
          <Direction />
          <ColorSelect />
          <li>
            <Link href="https://themeforest.net/user/pixelstrap/portfolio" target="_blank">
              <Button size="sm" color="tarnsparent" className="dark-buttton theme-color">
                Buy
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
export default ThemeCustomizer;

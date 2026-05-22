import { CommonPath, Weaccept } from "@/Constant";
import Image from "next/image";
import Link from "next/link";
import { Col } from "reactstrap";

const SubFooter = () => {
  return (
    <Col md="6">
      <ul>
        <li className="font-dark">{Weaccept}</li>
        <li>
          <Link href="#javascript">
            <Image width={37} height={21} src={`${CommonPath}/payment-icon/1.jpg`} className="img-fluid" alt="payment icon" />
          </Link>
        </li>
        <li>
          <Link href="#javascript">
            <Image width={36} height={21} src={`${CommonPath}/payment-icon/2.jpg`} className="img-fluid" alt="payment icon" />
          </Link>
        </li>
        <li>
          <Link href="#javascript">
            <Image width={36} height={21} src={`${CommonPath}/payment-icon/3.jpg`} className="img-fluid" alt="payment icon" />
          </Link>
        </li>
        <li>
          <Link href="#javascript">
            <Image width={55} height={21} src={`${CommonPath}/payment-icon/4.jpg`} className="img-fluid" alt="payment icon" />
          </Link>
        </li>
      </ul>
    </Col>
  );
};
export default SubFooter;

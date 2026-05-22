import { CHANGECOMPARE } from "@/ReduxToolkit/Reducers/CompareReducer";
import { PostCartData } from "@/Utils";
import { useRouter } from "next/navigation";
import { RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const CompareProducts = ({ elem, staticActions }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const compareProducts = useSelector((state) => state.CompareReducer.compareProducts);
  const ProductCompare = () => {
    if (staticActions) {
      router.push("/page/compare");
    } else {
      PostCartData(`/api/addtocompare`, { id: elem?.id })
        .then((res) => {
          const updatedComparelist = [...compareProducts, elem?.id];
          dispatch(CHANGECOMPARE(updatedComparelist));
          localStorage.setItem("compareProducts", JSON.stringify(updatedComparelist));
        })
        .catch((error) => {
          return "There was an error!", error;
        });
      toast.success("Item Added");
    }
  };
  return (
    <li onClick={ProductCompare}>
      <a href="#javascript">
        <RefreshCw />
      </a>
    </li>
  );
};

export default CompareProducts;

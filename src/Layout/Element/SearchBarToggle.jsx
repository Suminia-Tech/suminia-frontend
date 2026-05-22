import { useEffect, useState } from "react";
import { Search, X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Input, InputGroup } from "reactstrap";
import { getAPIData } from "../../Utils";
import SearchSuggestion from "./SearchSuggestion";
import { IS_FOCUS, IS_SEARCH } from "@/ReduxToolkit/Reducers/AllReducer";

const SearchBarToggle = () => {
  const dispatch = useDispatch();
  const { Is_Search, Is_Focus } = useSelector((state) => state.CommonReducer);
  const [onInputText, setOnInputText] = useState("");
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    getAPIData(`/api/products`).then((res) => setProductData(res?.data));
  }, []);
  const FilteredData = productData?.filter((el) => el.name.toLowerCase().includes(onInputText.toLowerCase()));
  const handleChange = (e) => {
    setOnInputText(e.target.value);
    dispatch(IS_FOCUS(true));
  };
  const handleClick = () => {
    dispatch(IS_SEARCH());
    dispatch(IS_FOCUS(false));
  };
  return (
    <div className={`search-full${Is_Search ? " open show" : ""}`}>
      <InputGroup>
        <span className="input-group-text">
          <Search className="font-light" />
        </span>
        <Input type="text" className="search-type" placeholder="Search here.." onChange={(e) => handleChange(e)} />
        <span className="input-group-text close-search" onClick={() => handleClick()}>
          <X className="font-light" />
        </span>
      </InputGroup>
      <SearchSuggestion FilteredData={FilteredData} Is_Focus={Is_Focus} />
    </div>
  );
};
export default SearchBarToggle;

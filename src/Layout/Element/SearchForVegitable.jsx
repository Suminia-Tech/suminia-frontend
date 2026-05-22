import { useEffect, useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import { getAPIData } from "../../Utils";
import SearchSuggestion from "./SearchSuggestion";
import { IS_FOCUS } from "@/ReduxToolkit/Reducers/AllReducer";

const SearchForVegitable = () => {
  const dispatch = useDispatch();
  const { Is_Focus } = useSelector((state) => state.CommonReducer);
  const [onInputText, setOnInputText] = useState("");
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    getAPIData(`/api/products`).then((res) => {
      setProductData(res?.data);
    });
  }, []);
  const FilteredData = productData.filter((el) => el.name.toLowerCase().includes(onInputText.toLowerCase()));
  const handleChange = (e) => {
    setOnInputText(e.target.value);
    dispatch(IS_FOCUS(true));
  };
  return (
    <div className={`search-box1 d-lg-block d-none ${onInputText.length > 0 ? "show" : ""}`}>
      <div className="the-basics input-group">
        <Input type="text" className="form-control typeahead" placeholder="Search a Product" onChange={(e) => handleChange(e)} />
        <span className="input-group-text close-search theme-bg-color search-box">
          <Search />
        </span>
      </div>
      <SearchSuggestion FilteredData={FilteredData} Is_Focus={Is_Focus} />
    </div>
  );
};

export default SearchForVegitable;

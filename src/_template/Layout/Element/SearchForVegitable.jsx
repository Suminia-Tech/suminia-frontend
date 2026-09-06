import { useEffect, useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import { getAPIData } from "../../Utils";
import SearchSuggestion from "./SearchSuggestion";
import { IS_FOCUS } from "@/_template/ReduxToolkit/Reducers/AllReducer";

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
    <div className={`search-box1 d-lg-flex d-none align-items-center ${onInputText.length > 0 ? "show" : ""}`} style={{ width: "70%", marginLeft: "24px" }}>
      <div className="the-basics input-group" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
        <Input type="text" className="form-control typeahead" placeholder="Buscar un producto" onChange={(e) => handleChange(e)} style={{ borderRadius: '0.5rem 0 0 0.5rem', borderRight: 'none' }} />
        <span className="input-group-text close-search theme-bg-color search-box" style={{ borderRadius: '0 0.5rem 0.5rem 0' }}>
          <Search />
        </span>
      </div>
      <SearchSuggestion FilteredData={FilteredData} Is_Focus={Is_Focus} />
    </div>
  );
};

export default SearchForVegitable;

import { IS_FOCUS, IS_SEARCH } from "@/ReduxToolkit/Reducers/AllReducer";
import { Search } from "react-feather";
import { useDispatch } from "react-redux";
const SearchBar = () => {
  const dispatch = useDispatch();
  const toggleSearch = () => {
    dispatch(IS_SEARCH());
    dispatch(IS_FOCUS());
  };
  return (
    <li onClick={() => toggleSearch()}>
      <div className="search-box">
        <Search />
      </div>
    </li>
  );
};
export default SearchBar;

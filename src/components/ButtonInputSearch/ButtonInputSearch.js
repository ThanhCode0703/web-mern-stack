import { SearchOutlined } from "@ant-design/icons";

import "./ButtonInputSearch.css";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

function ButtonInputSearch(props) {
  const { size, placeholder, ...rests } = props;
  return (
    <div className="Search">
      <InputComponent
        className="search-input"
        size={size}
        style={{ height: "46px" }}
        placeholder={placeholder}
        {...rests}
      />
      <ButtonComponent
        className="search-button"
        size={size}
        style={{ height: "46px" }}
        icon={<SearchOutlined />}
      ></ButtonComponent>
    </div>
  );
}

export default ButtonInputSearch;

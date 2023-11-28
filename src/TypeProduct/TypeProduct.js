import { useNavigate } from "react-router-dom";
import "./TypeProduct.css";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";

function TypeProduct({ name, typeProduct }) {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "-")}`,
      { state: type }
    );
  };

  return (
    <div>
      <ButtonComponent
        className="type-product-name text-capitalize"
        textButton={name}
        onClick={() => handleNavigateType(name)}
      />
    </div>
  );
}

export default TypeProduct;

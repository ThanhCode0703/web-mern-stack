import ProductDetailsComponent from "../../../ProductDetailsComponent/ProductDetailsComponent";
import React from "react";
import "./ProductDetailsPage.css";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();
  return (
    <div className="container-product-details-page">
      <b
        style={{ padding: "0 120px", cursor: "pointer", fontWeight: "bold" }}
        onClick={() => {
          navigate("/");
        }}
      >
        Trang Chủ
      </b>
      <div className="wrapper-product-details-component">
        <div>
          <ProductDetailsComponent idProduct={id} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;

import ProductDetailsComponent from "../../../ProductDetailsComponent/ProductDetailsComponent";
import React from "react";
import "./ProductDetailsPage.css";
import { useParams } from "react-router-dom";

function ProductDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container-product-details-page">
      <div className="wrapper-product-details-component">
        <div className="product-details">
          <ProductDetailsComponent idProduct={id} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;

import ProductDetailsComponent from "../../../ProductDetailsComponent/ProductDetailsComponent";
import React from "react";
import "./ProductDetailsPage.css";
function ProductDetailsPage() {
  return (
    <div className="container-product-details-page">
      <b style={{ padding: "0 120px" }}>Trang Chủ</b>
      <div className="wrapper-product-details-component">
        <div>
          <ProductDetailsComponent />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;

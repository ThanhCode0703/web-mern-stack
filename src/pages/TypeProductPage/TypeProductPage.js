import { Col, Row } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import React from "react";
import "./TypeProductPage.css";
function TypeProductPage() {
  return (
    <div className="container-type-product-page">
      <div className="wrapper-type-product-page">
        <Row>
          <Col className="card-type" span={4}>
            <NavbarComponent />
          </Col>
          <Col span={20}>
            <div className="wrapper-type-card-component">
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default TypeProductPage;

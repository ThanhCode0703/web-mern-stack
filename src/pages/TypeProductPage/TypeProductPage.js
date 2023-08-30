import { Col, Row } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import React from "react";
import "./TypeProductPage.css";
function TypeProductPage() {
  return (
    <div className="wrapper-navbar-card">
      <Row>
        <Col className="card-type" span={8}>
          <NavbarComponent />
        </Col>
        <Col span={16}>
          <CardComponent />
        </Col>
      </Row>
    </div>
  );
}

export default TypeProductPage;

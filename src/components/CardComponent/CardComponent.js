import { Card } from "antd";
import React from "react";
import "./CardComponent.css";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
function CardComponent() {
  return (
    <div className="card-component">
      <Card
        hoverable
        style={{ width: "200px" }}
        bodyStyle={{ padding: "10px" }}
        cover={
          <img
            alt="example"
            src="https://salt.tikicdn.com/cache/750x750/ts/product/a2/38/6c/ce008c63f4ac771550439da44f5f8ee8.png"
          />
        }
      >
        <img className="logo-card-component" src={logo} alt="logo" />
        <div>Iphone</div>

        <div className="description">
          {" "}
          <span>
            <span>4.5</span>
            <StarFilled className="star" />
          </span>
          <span> | Đã Bán 1000+</span>
          <div className="cost">
            16.090.000 ₫<span className="discount"> -25% </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CardComponent;

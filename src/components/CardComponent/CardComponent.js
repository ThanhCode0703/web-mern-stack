import { Card } from "antd";
import React from "react";
import "./CardComponent.css";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
function CardComponent(props) {
  const {
    countInStock,
    description,
    discount,
    image,
    name,
    price,
    rating,
    type,
    selled,
  } = props;

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
        <div>{name}</div>

        <div className="description">
          {" "}
          <span>
            <span>{rating}</span>
            <StarFilled className="star" />
          </span>
          <span> | Đã Bán {selled || 1000}+</span>
          <div className="cost">
            {price}
            <span className="discount">{discount || 5}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CardComponent;

import { Card } from "antd";
import React from "react";
import "./CardComponent.css";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";
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
    sold,
    id,
  } = props;
  const navigate = useNavigate();
  const handleDetailsProduct = (id) => {
    if (id) {
      navigate(`/product-detail/${id}`);
    }
  };

  return (
    <div className="card-component">
      <Card
        hoverable
        style={{ width: "200px", minHeight: "350px" }}
        bodyStyle={{ padding: "10px" }}
        onClick={() => handleDetailsProduct(id)}
        cover={<img className="anh" alt="example" src={image} />}
        // disable={countInStock === 0 ? true : false}
      >
        <img className="logo-card-component" src={logo} alt="logo" />
        <div className="wrapper-card-component-name">{name}</div>
        <div className="description">
          {" "}
          <span>
            <span>{rating}</span>
            <StarFilled className="star" />
          </span>
          <span> | Đã Bán {sold || 100}+</span>
          <div className="cost">
            {convertPrice(price)}
            <span className="discount-product">- {discount || 5}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CardComponent;

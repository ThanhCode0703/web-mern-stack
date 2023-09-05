import { Col, Image, InputNumber, Row } from "antd";
import React from "react";
import BanhTrungThu from "../assets/images/banhtrungthu.png";
import SmallBanhTrungThu1 from "../assets/images/smallbanhtrungthu1.png";
import SmallBanhTrungThu2 from "../assets/images/smallbanhtrungthu2.png";
import SmallBanhTrungThu3 from "../assets/images/smallbanhtrungthu3.png";
import SmallBanhTrungThu4 from "../assets/images/smallbanhtrungthu4.png";
import "./ProductDetailsComponent.css";
import { StarFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
function ProductDetailsComponent() {
  const onChange = () => {};
  return (
    <div className="container-product-details">
      <Row className="wrapper-product-details">
        <Col span={10}>
          <Image
            className="product-image"
            src={BanhTrungThu}
            alt="banh trung thu"
            preview={false}
          />
          <Row className="small-image">
            <Col span={4}>
              <Image
                src={SmallBanhTrungThu1}
                alt="small banh trung thu"
                preview={false}
              />
            </Col>
            <Col span={4}>
              <Image
                src={SmallBanhTrungThu2}
                alt="small banh trung thu"
                preview={false}
              />
            </Col>
            <Col span={4}>
              <Image
                src={SmallBanhTrungThu3}
                alt="small banh trung thu"
                preview={false}
              />
            </Col>
            <Col span={4}>
              <Image
                src={SmallBanhTrungThu4}
                alt="banh trung thu"
                preview={false}
              />
            </Col>
            <Col span={4}>
              <Image
                src={SmallBanhTrungThu4}
                alt="banh trung thu"
                preview={false}
              />
            </Col>
            <Col span={4}>
              <Image
                src={SmallBanhTrungThu4}
                alt="banh trung thu"
                preview={false}
              />
            </Col>
          </Row>
        </Col>
        <Col span={14}>
          <div className="wrapper-style-name-product">
            Hộp bánh trung thu Kinh Đô - Trăng Vàng Black & Gold Yến Sào: 4 Bánh
            x 160gr và Trà + Tặng bộ lồng đèn, đầu lân, mặt nạ ông địa
          </div>
          <div className="style-star">
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarFilled />

            <span className="navbar-view-evalute"> | Đã Bán 1000+</span>
          </div>
          <Row>
            <Col span={16}>
              <div className="wrapper-price">
                <div className="flash-sale-price">
                  <span>580.000₫</span>
                  <div className="sale">
                    <span className="list-sale">686.000₫</span>
                    <span className="discount">-16%</span>
                  </div>
                </div>
              </div>
              <div className="wrapper-address-product">
                <span> Giao tới </span>
                <span className="address">
                  Q. 12, P. Tân Chánh Hiệp, Hồ Chí Minh
                </span>
                -<span className="address-change"> Đổi địa chỉ </span>
              </div>
              <div className="wrapper-quality-product">
                <p className="lable"> Số lượng </p>
                <div className="wrapper-button">
                  <button type="button" className="btn btn-secondary">
                    <MinusOutlined />
                  </button>
                  <button className="btn btn-light">
                    <InputNumber
                      className="input-product"
                      min={1}
                      max={10}
                      defaultValue={3}
                      onChange={onChange}
                    />
                  </button>
                  <button type="button" className="btn btn-secondary">
                    <PlusOutlined />
                  </button>
                </div>
              </div>
              <div className="group-button">
                <button type="button" className="btn btn-lg button-buy">
                  Chọn Mua
                </button>
                <button type="button" className="btn btn-lg button-buy0">
                  Mua trước trả sau
                  <p className="interest-rate"> lãi suất 0%</p>
                </button>
              </div>
            </Col>
            <Col span={8}></Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ProductDetailsComponent;

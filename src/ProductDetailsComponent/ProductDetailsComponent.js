import { Col, Image, InputNumber, Rate, Row } from "antd";
import React, { useState } from "react";
import "./ProductDetailsComponent.css";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import * as ProductService from "../service/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../utils";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../redux/slides/orderSlide";

function ProductDetailsComponent(idProduct) {
  const [numProduct, setNumProduct] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const onChange = (e) => {
    setNumProduct(Number(e.target.value));
  };
  const user = useSelector((state) => state?.user);
  // nhớ kiểm tra xem đã truyền đúng định dạng của dữ liệu hay chưa
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1].idProduct; // phải chấm tới idProduct mới lấy được idProduct, còn chấm tới queryKey thì nó sẽ trỏ vào oj
    const res = await ProductService.getDetailProduct(id);
    return res;
  };

  const { isLoading, data: productsDetails } = useQuery(
    ["product-details", idProduct],
    fetchGetDetailsProduct,
    { enabled: !!idProduct }
  );

  const handleAddOderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productsDetails?.data.name,
            amount: numProduct,
            image: productsDetails?.data.image,
            discount: productsDetails?.data.discount,
            price: productsDetails?.data.price,
            countInStock: productsDetails?.data.countInStock,
            product: productsDetails?.data._id,
          },
        })
      );
    }
  };
  return (
    <Loading isLoading={isLoading}>
      <div className="container-product-details">
        <Row className="wrapper-product-details">
          <Col span={6} className="wrapper-product-details-img">
            <div>
              <Image
                className="product-image"
                src={productsDetails?.data?.image}
                alt="banh trung thu"
                preview={false}
              />
            </div>
            {/* <Row className="small-image">
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
            </Row> */}
          </Col>
          <Col span={18}>
            <div className="container-details-price">
              <div className="wrapper-style-name-product">
                {productsDetails?.data?.name}
              </div>
              <div className="style-star">
                <Rate
                  allowHalf
                  defaultValue={productsDetails?.data?.rating}
                  value={productsDetails?.data?.rating}
                />

                <span className="navbar-view-evalute"> | Đã Bán 1000+</span>
              </div>

              <div className="wrapper-price">
                <div className="flash-sale-price">
                  <span>{convertPrice(productsDetails?.data?.price)}</span>
                  <div className="sale">
                    <span className="list-sale"> Giảm giá </span>
                    <span className="discount-product-details">
                      - {productsDetails?.data?.discount} %
                    </span>
                  </div>
                </div>
              </div>
              <div className="wrapper-address-product">
                <span> Giao tới :</span>
                <span className="address">{user.address}</span> -
                <span className="address-change"> Đổi địa chỉ </span>
              </div>
              <div className="wrapper-quality-product">
                <div className="wrapper-button-quantity">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setNumProduct(numProduct - 1)}
                  >
                    <MinusOutlined />
                  </button>

                  <InputNumber
                    className="input-product"
                    value={numProduct > 0 ? numProduct : setNumProduct(1)}
                    // min={1}
                    // max={10}

                    // defaultValue={3}
                    onChange={onChange}
                  />

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setNumProduct(numProduct + 1)}
                  >
                    <PlusOutlined />
                  </button>
                </div>
              </div>
              <div className="group-button">
                <button
                  type="button"
                  className="btn btn-lg button-buy"
                  onClick={handleAddOderProduct}
                >
                  Chọn Mua
                </button>
                <button type="button" className="btn btn-lg button-buy0">
                  Mua trước trả sau
                  <p className="interest-rate"> lãi suất 0%</p>
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Loading>
  );
}

export default ProductDetailsComponent;

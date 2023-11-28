import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";

import * as OrderService from "../../service/OrderService";
import { useQuery } from "@tanstack/react-query";
import { orderConstant } from "../../content";
import { convertPrice } from "../../utils";
import Loading from "../../loading/loading";
import "./DetailsOrderPage.css";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrders(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery(
    { queryKey: ["orders-details"], queryFn: fetchDetailsOrder },
    {
      enabled: id,
    }
  );
  const { isLoading, data } = queryOrder;

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);
  return (
    <Loading isLoading={isLoading}>
      <div className="details-order-container">
        <div style={{ width: "1270px", margin: "0 auto", height: "1270px" }}>
          <h4>Chi tiết đơn hàng</h4>
          <div className="wrapper-header-user-detail-order">
            <div className="wrapper-info-user-detail-order">
              <div className="wrapper-label-detail-order">
                Địa chỉ người nhận
              </div>
              <div className="wrapper-content-info-detail-order">
                <div className="name-info">
                  {data?.shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>Địa chỉ: </span>{" "}
                  {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span>Điện thoại: </span> {data?.shippingAddress?.phone}
                </div>
              </div>
            </div>
            <div className="wrapper-info-user-detail-order">
              <div className="wrapper-label-detail-order">
                Hình thức giao hàng
              </div>
              <div className="wrapper-content-info-detail-order">
                <div className="delivery-info">
                  <span className="name-delivery">FAST </span>Giao hàng tiết
                  kiệm
                </div>
                <div className="delivery-fee">
                  <span>Phí giao hàng: </span>{" "}
                  {convertPrice(data?.shippingPrice)}
                </div>
              </div>
            </div>
            <div className="wrapper-info-user-detail-order">
              <div className="wrapper-label-detail-order">
                Hình thức thanh toán
              </div>
              <div className="wrapper-content-info-detail-order">
                <div className="payment-info">
                  {orderConstant.payment[data?.paymentMethod]}
                </div>
                <div className="status-payment">
                  {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
              </div>
            </div>
          </div>
          <div className="wrapper-style-content-detail-order">
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "670px" }}>Sản phẩm</div>
              <div className="wrapper-item-label-detail-order">Giá</div>
              <div className="wrapper-item-label-detail-order">Số lượng</div>
              <div className="wrapper-item-label-detail-order">Giảm giá</div>
            </div>
            {data?.orderItems?.map((order) => {
              return (
                <div className="wrapper-product-detail-order">
                  <div className="wrapper-product-name-detail-order">
                    <img
                      src={order?.image}
                      alt=""
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        border: "1px solid rgb(238, 238, 238)",
                        padding: "2px",
                      }}
                    />
                    <div
                      style={{
                        width: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginLeft: "10px",
                        height: "70px",
                      }}
                    >
                      Điện thoại
                    </div>
                  </div>
                  <div className="wrapper-item-detail-order">
                    {convertPrice(order?.price)}
                  </div>
                  <div className="wrapper-item-detail-order">
                    {order?.amount}
                  </div>
                  <div className="wrapper-item-detail-order">
                    {order?.discount
                      ? convertPrice((priceMemo * order?.discount) / 100)
                      : "0 VND"}
                  </div>
                </div>
              );
            })}

            <div className="wrapper-all-price-detail-order">
              <div className="wrapper-item-label-detail-order">Tạm tính</div>
              <div className="wrapper-item-detail-order">
                {convertPrice(priceMemo)}
              </div>
            </div>
            <div className="wrapper-all-price-detail-order">
              <div className="wrapper-item-label-detail-order">
                Phí vận chuyển
              </div>
              <div className="wrapper-item-detail-order">
                {convertPrice(data?.shippingPrice)}
              </div>
            </div>
            <div className="wrapper-all-price-detail-order">
              <div className="wrapper-item-label-detail-order">Tổng cộng</div>
              <div className="wrapper-item-detail-order">
                <div className="wrapper-item-detail-order">
                  {convertPrice(data?.totalPrice)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default DetailsOrderPage;

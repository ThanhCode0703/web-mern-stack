import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../service/OrderService";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import "./MyOrderPage.css";
import Loading from "../../loading/loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { message } from "antd";
import { useEffect } from "react";
import { UserMutationHook } from "../../hook/UseMutationHook";
const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderDetails(state?.id);

    return res.data;
  };
  const user = useSelector((state) => state.user);

  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: fetchMyOrder },
    {
      enabled: state?.id,
    }
  );
  const { isLoading, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`);
  };

  const mutation = UserMutationHook((data) => {
    const { id, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, orderItems, userId);
    return res;
  });

  const handleCanceOrder = (order) => {
    mutation.mutate({
      id: order._id,
      orderItems: order?.orderItems,
      userId: user.id,
    });
  };
  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;
  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("xóa đơn hàng thành công");
      window.location.reload();
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancle) {
      message.error(isErrorCancle);
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <div className="wrapper-header-items-orders" key={order?._id}>
          <img
            className="image-items-order-myorder"
            src={order?.image}
            alt="aaaa"
          />
          <div className="name-items-order-myorder">{order?.name}</div>
          <span className="price-items-order-myorder">
            {convertPrice(order?.price)}
          </span>
        </div>
      );
    });
  };

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <div className="my-order-page-container">
        <div className="my-order-page-container-lv2">
          <h2>Đơn hàng của tôi</h2>
          <div className="wrapper-list-order">
            {data?.map((order) => {
              return (
                <div className="wrapper-items-order" key={order?._id}>
                  <div className="wrapper-status-orders">
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      Trạng thái
                    </span>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Giao hàng:{" "}
                      </span>
                      <span
                        style={{
                          color: "rgb(90, 32, 193)",
                          fontWeight: "bold",
                        }}
                      >{`${
                        order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
                      }`}</span>
                    </div>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Thanh toán:{" "}
                      </span>
                      <span
                        style={{
                          color: "rgb(90, 32, 193)",
                          fontWeight: "bold",
                        }}
                      >{`${
                        order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"
                      }`}</span>
                    </div>
                  </div>
                  {renderProduct(order?.orderItems)}
                  <div className="wrapper-footer-item">
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Tổng tiền:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgb(56, 56, 61)",
                          fontWeight: 700,
                        }}
                      >
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <ButtonComponent
                        className="cancel-btn-order"
                        onClick={() => handleCanceOrder(order)}
                        size="large"
                        textButton="Hủy đơn hàng"
                      ></ButtonComponent>
                      <ButtonComponent
                        className="show-details-order"
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        textButton="Xem chi tiết"
                      ></ButtonComponent>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default MyOrderPage;

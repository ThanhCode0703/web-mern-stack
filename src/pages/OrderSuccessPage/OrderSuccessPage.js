import Loading from "../../loading/loading";
import "./OrderSuccessPage.css";
import { orderConstant } from "../../content";
import { useLocation } from "react-router-dom";
import { convertPrice } from "../../utils";

const OrderSuccessPage = () => {
  const location = useLocation();
  const { state } = location;
  return (
    <div className="payment-success-page-container">
      <h2 className="title-page">Đặt hàng thành công</h2>
      <Loading isLoading={false}>
        <div className="payment-success-page-wrapper">
          <div className="wrapper-infor-payment-success">
            <div>
              <span className="label-payment-success">
                Phương thức giao hàng
              </span>
              <div className="payment-success-4">
                <span>{orderConstant.delivery[state?.delivery]}</span>
              </div>
            </div>

            <div>
              <span className="label-payment-success">
                Phương thức thanh toán
              </span>
              <div className="payment-success-lable">
                <span>{orderConstant.payment[state?.payment]}</span>
              </div>
            </div>
            <div className="wrapper-info-payment-success">
              {state?.orders?.map((order) => {
                return (
                  <div
                    className="wrapper-order-items-success"
                    key={order?.orderItemsSelected?.product}
                  >
                    <div className="wrapper-order-image-name-success">
                      <img
                        src={order?.image}
                        className="order-image-order-page-success"
                        alt="orderimage"
                      />
                      <div className="order-name-order-page-success">
                        {order?.name}
                      </div>
                    </div>
                    <div className="order-count-order-page-success">
                      <span>
                        <span className="order-count-span-order-page-success">
                          Giá tiền:
                          {convertPrice(order?.price)}
                        </span>
                      </span>
                      <span>
                        <span className="order-count-span-order-page-success">
                          Số lượng: {order?.amount}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="total-price-payment-success">
              Tổng tiền: {convertPrice(state.totalPriceMemo)}
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default OrderSuccessPage;

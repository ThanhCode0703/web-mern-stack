import { Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/Modal/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as message from "../../message/message";
import * as OrderService from "../../service/OrderService";
import * as UserService from "../../service/UserService";
import * as PaymentService from "../../service/PaymentService";
import { convertPrice } from "../../utils";
import { UserMutationHook } from "../../hook/UseMutationHook";
import { updateUser } from "../../redux/slides/userSlide";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import Loading from "../../loading/loading";
import "./PaymentPay.css";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo < 2000000) {
      return 20000;
    } else if (priceMemo === 0) {
      return 0;
    } else {
      return 10000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

  const handleAddOrder = () => {
    // -------------------------

    if (
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate({
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  const mutationUpdate = UserMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = UserMutationHook((data) => {
    const { ...rests } = data;
    const res = OrderService.createOrder({ ...rests });
    return res;
  });

  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;
  const { isLoading, data } = mutationUpdate;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItems?.forEach((element) => {
        arrayOrdered.push(element.product);
      });

      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      orderItems: order?.orderItemsSelected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: diliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      email: user?.email,
      isPaid: true,
      paidAt: details.update_time,
    });
  };
  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleDilivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  return (
    <div className="payment-page-container">
      <Loading isLoading={isLoadingAddOrder}>
        <div className="payment-page-all-wrapper">
          <h3>Thanh toán</h3>
          <div className="payment-page-wrapper">
            <div className="Wrapper-left">
              <div className="wrapper-infor-payment">
                <div>
                  <span className="payment-lable">
                    Chọn phương thức giao hàng
                  </span>
                  <Radio.Group
                    className="wrapper-radio-payment"
                    onChange={handleDilivery}
                    value={delivery}
                  >
                    <Radio value="fast">
                      <span className="span">FAST</span> Giao hàng tiết kiệm
                    </Radio>
                    <Radio value="gojek">
                      <span className="span">GO_JEK</span> Giao hàng tiết kiệm
                    </Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="wrapper-infor-payment">
                <div>
                  <span className="payment-lable">
                    Chọn phương thức thanh toán
                  </span>
                  <Radio.Group
                    className="wrapper-radio-payment"
                    onChange={handlePayment}
                    value={payment}
                  >
                    <Radio value="later_money">
                      Thanh toán tiền mặt khi nhận hàng
                    </Radio>
                    <Radio value="paypal"> Thanh toán online với paypal</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="wrapper-right-payment">
              <div style={{ width: "100%" }}>
                <div className="wrapper-infor-payment">
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{ fontWeight: "bold" }}>
                      {`${user?.address} ${user?.city}`}{" "}
                    </span>
                    <span
                      onClick={handleChangeAddress}
                      style={{ color: "#9255FD", cursor: "pointer" }}
                    >
                      Thay đổi
                    </span>
                  </div>
                </div>
                <div className="wrapper-infor-payment">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Tạm tính</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Giảm giá</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceDiscountMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Phí giao hàng</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(diliveryPriceMemo)}
                    </span>
                  </div>
                </div>
                <div className="wrapper-total-payment">
                  <span style={{ fontWeight: "bold" }}>Tổng tiền</span>
                  <span className="total-price-wrapper">
                    <span className="total-price-usememo">
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span className="total-price-vat">
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </span>
                </div>
              </div>
              {payment === "paypal" && sdkReady ? (
                <div style={{ width: "320px" }}>
                  <PayPalButtons
                    amount={Math.round(priceMemo / 23000)}
                    onClick={onSuccessPaypal}
                    onError={(e) => {
                      alert(e);
                    }}
                  />
                  {/* <PayPalButtons
                    amount={totalPriceMemo / 23000}
                    value={totalPriceMemo / 23000}
                    // shippingPreference="NO_SHIPPING"
                    // default is "GET_FROM_FILE"
                    onSuccess={() => alert("thanhf coong ")}
                    onError={(e) => {
                      alert(e);
                    }}
                  /> */}
                </div>
              ) : (
                <ButtonComponent
                  onClick={handleAddOrder}
                  className="btn-order-payment"
                  size={40}
                  textButton="Đặt hàng"
                />
              )}
            </div>
          </div>
        </div>
        <ModalComponent
          forceRender
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancleUpdate}
          onOk={handleUpdateInforUser}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <InputComponent
                  value={stateUserDetails["name"]}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please input your city!" }]}
              >
                <InputComponent
                  value={stateUserDetails["city"]}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please input your  phone!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Adress"
                name="address"
                rules={[
                  { required: true, message: "Please input your  address!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default PaymentPage;

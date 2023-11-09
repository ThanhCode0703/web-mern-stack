import { Checkbox, Form, InputNumber, message } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import "./OrderPage.css";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ModalComponent from "../../components/Modal/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../service/UserService";
import { updateUser } from "../../redux/slides/userSlide";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { useEffect, useMemo, useState } from "react";
import { convertPrice } from "../../utils";
import { UserMutationHook } from "../../hook/UseMutationHook";
import Loading from "../../loading/loading";
import { useNavigate } from "react-router-dom";

function OrderPage() {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };
  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };
  const handleDeleteAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };
  useEffect(() => {
    dispatch(selectedOrder(listChecked));
  }, [listChecked]);
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

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);
  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.discount * cur.amount;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);
  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 2000000 && priceMemo < 5000000) {
      return 10000;
    } else if (
      priceMemo >= 5000000 ||
      order?.orderItemsSelected?.length === 0
    ) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);
  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const mutationUpdate = UserMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, rests);
    return res;
  });

  const { isLoading, data } = mutationUpdate;
  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  return (
    <div className="order-page-container">
      <div className="order-page-wrapper">
        <h3>Giỏ hàng</h3>
        <div className="order-page-cover">
          <div className="order-page-wrapper-left">
            <div className="order-wrapper-header-delivery">
              <p>Phí giao hàng</p>
            </div>
            <div className="wrapper-header-styte">
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox
                  className="order-product-checkbox"
                  onClick={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></Checkbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div className="order-status-bar">
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <ButtonComponent
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteAllOrder}
                  danger
                />
              </div>
            </div>
            <div>
              {order?.orderItems?.map((order) => {
                return (
                  <div className="wrapper-order-items" key={order?.product}>
                    <div className="wrapper-order-image-name">
                      <Checkbox
                        className="order-product-checkbox"
                        onClick={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></Checkbox>
                      <img
                        src={order?.image}
                        className="order-image-order-page"
                        alt="orderimage"
                      />
                      <div className="order-name-order-page">{order?.name}</div>
                    </div>
                    <div className="order-count-order-page">
                      <span>
                        <span className="order-count-span-order-page">
                          {convertPrice(order?.price)}
                        </span>
                      </span>
                      <div className="wrapper-count-order">
                        <ButtonComponent
                          icon={
                            <MinusOutlined
                              style={{ color: "#000", fontSize: "10px" }}
                            />
                          }
                          className="btn-minus-plus-order"
                          onClick={() =>
                            handleChangeCount("decrease", order?.product)
                          }
                        />

                        <InputNumber
                          style={{ width: "40px" }}
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                          min={1}
                          max={order?.countInstock}
                        />
                        <ButtonComponent
                          className="btn-minus-plus-order"
                          icon={
                            <PlusOutlined
                              style={{ color: "#000", fontSize: "10px" }}
                            />
                          }
                          onClick={() =>
                            handleChangeCount("increase", order?.product)
                          }
                        />
                      </div>
                      <span className="order-price-order-page">
                        {order?.price * order?.amount}
                      </span>
                      <ButtonComponent
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="wrapper-right">
            <div style={{ width: "100%" }}>
              <div className="wrapper-info">
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {`${user?.address} `},{" "}
                  </span>
                  <span className="user-address-order-page">{`${
                    user?.city || "Chưa có"
                  }`}</span>
                  &nbsp; &nbsp;
                  <span
                    style={{ color: "#75C2F6", cursor: "pointer" }}
                    onClick={handleChangeAddress}
                  >
                    Thay đổi
                  </span>
                </div>
              </div>
              <div className="wrapper-info">
                <div className="wrapper-info-provisional">
                  <span>Tạm tính</span>
                  <span>{convertPrice(priceMemo)}</span>
                </div>
                <div className="wrapper-info-discount">
                  <span>Giảm giá</span>
                  <span> {priceDiscountMemo}%</span>
                </div>
                <div className="wrapper-info-delivery-charges">
                  <span>Phí giao hàng</span>{" "}
                  <span>{convertPrice(diliveryPriceMemo)}</span>
                </div>
              </div>
              <div className="wrapper-total">
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254, 56, 52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span style={{ color: "#000", fontSize: "11px" }}>
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </div>

              <ButtonComponent
                className="add-card-btn"
                size={40}
                onClick={handleAddCard}
                textButton="Mua hàng"
              />
            </div>
          </div>
        </div>
      </div>
      <ModalComponent
        forceRender
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onC={handleUpdateInforUser}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                name="name"
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <InputComponent
                name="city"
                value={stateUserDetails.city}
                onChange={handleOnchangeDetails}
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your  phone!" }]}
            >
              <InputComponent
                name="phone"
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
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
                name="address"
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
}

export default OrderPage;

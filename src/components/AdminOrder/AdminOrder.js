import { Col, Modal, Row, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InfoCircleOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TableComponent from "../../components/Table/TableComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as OrderService from "../../service/OrderService";
import { convertPrice } from "../../utils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import "./AdminOrder.css";
import Loading from "../../loading/loading";
import PieChartComponent from "./PieChart/PieChartComponent";

function AdminOrder() {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isOpenChart, setIsOpenChart] = useState(false);
  const user = useSelector((state) => state?.user);
  //thông tin hóa Đơn
  const [stateOrder, setStateOrder] = useState({
    createdAt: "",
    isDelivered: "",
    isPaid: "",
    itemsPrice: "",
    orderItems: [],
    paymentMethod: "",
    shippingAddress: {},
    shippingPrice: 0,
    totalPrice: 0,
  });
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);

    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });
  const { isLoading: isLoadingOrder, data: orders } = queryOrder;
  const handleOpenModal = () => {
    setIsOpenModal(true);
    setIsLoadingModal(true);
    setIsLoadingModal(false);
    toast.success("Lấy thông tin đơn hàng thành công!");
  };
  //thao tác
  const renderUserActions = () => {
    return (
      <div className="actions-order-admin-page">
        <ButtonComponent
          type="default"
          icon={<InfoCircleOutlined />}
          onClick={handleOpenModal}
        />
        &nbsp;
      </div>
    );
  };
  //close detail
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setStateOrder({
      createdAt: "",
      isDelivered: "",
      isPaid: "",
      itemsPrice: "",
      orderItems: [],
      paymentMethod: "",
      shippingAddress: {},
      shippingPrice: 0,
      totalPrice: 0,
    });
  };
  const fetchDetailOrder = async () => {
    const res = await OrderService.getDetailsOrders(rowSelected);
    if (res?.data) {
      setStateOrder({
        createdAt: res.data.createdAt,
        isDelivered: res.data.isDelivered ? "Đã giao" : "Đang giao",
        isPaid: res.data.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
        itemsPrice: convertPrice(res.data.itemsPrice),
        orderItems: res.data.orderItems,
        paymentMethod:
          res.data.paymentMethod === "later_money"
            ? "Thanh toán khi nhận hàng"
            : "Thanh toán online với Paypal",
        shippingAddress: res.data.shippingAddress,
        shippingPrice: res.data.shippingPrice,
        totalPrice: res.data.totalPrice,
      });
    }
  };
  useEffect(() => {
    if (rowSelected) {
      fetchDetailOrder(rowSelected);
    }
  }, [rowSelected]);

  //đóng thông tin chi tiết
  const handleCancel = () => {
    handleCloseModal();
    setIsOpenModal(false);
    setRowSelected("");
  };
  const handleCancelChart = () => {
    setIsOpenChart(false);
  };
  //dữ liệu để đổ vào bảng
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
          <button type="button" className="btn btn-secondary">
            <i className="fa-solid fa-arrow-rotate-left"></i> Reset
          </button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
  });

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "username",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("username"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Giá tiền đơn hàng",
      dataIndex: "itemsPrice",
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalPrice",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "isDelivered",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: renderUserActions,
    },
  ];

  const dataOrder =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        username: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.address,
        isPaid: order.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
        totalPrice: convertPrice(order.totalPrice),
        itemsPrice: convertPrice(order.itemsPrice),
        isDelivered: order.isDelivered ? "Đã giao" : "Đang giao",
        paymentMethod:
          order.paymentMethod === "later_money"
            ? "Thanh toán khi nhận hàng"
            : "Paypal",
      };
    });
  return (
    <div className="user-admin-management-container">
      <h1> Quản lý hóa đơn </h1>
      <ButtonComponent
        className="chart-order-buy"
        textButton="Biểu đồ"
        onClick={() => setIsOpenChart(true)}
      />
      <div className="table-content-management-product">
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrder}
          data={dataOrder}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              }, // click row
            };
          }}
        />
      </div>
      <div className="detail-order-order-admin">
        <Modal
          width={800}
          title="Thông tin đơn hàng"
          open={isOpenModal}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <Loading isLoading={isLoadingModal}>
            <div className="order-detail-order-admin">
              <Row>
                <Col span={14} className="order-detail-order-admin-left">
                  <h3>Chi tiết đơn hàng</h3>
                  Ngày mua:{" "}
                  <b>
                    {stateOrder.createdAt &&
                      format(
                        new Date(stateOrder.createdAt),
                        "dd/MM/yyyy HH:mm"
                      )}
                  </b>
                  <br />
                  Trạng thái đơn hàng: <b>{stateOrder.isDelivered}</b>
                  <br />
                  Thanh toán: <b>{stateOrder.isPaid}</b>
                  <br />
                  Giá sản phẩm: <b>{stateOrder.itemsPrice}</b>
                  <br />
                  Hình thức thanh toán: <b>{stateOrder.paymentMethod}</b>
                  <br />
                  Phí giao hàng: <b>{stateOrder.shippingPrice}</b>
                  <br />
                  <div className="detail-product-in-order">
                    <b>Các sản phẩm đã mua:</b>
                    {stateOrder.orderItems.map((orderItem) => (
                      <div key={orderItem._id} className="product-detail-info">
                        Tên sản phẩm: <b>{orderItem.name}</b>
                        <br />
                        Giá bán: <b>{orderItem.price}</b>
                        <br />
                        <img
                          className="image-product-buy-order-admin"
                          src={orderItem.image}
                          alt="productBuy"
                        />
                      </div>
                    ))}
                  </div>
                  Tổng thanh toán:{" "}
                  <b style={{ color: "rgb(255, 57, 69)" }}>
                    {convertPrice(stateOrder.totalPrice)}
                  </b>
                </Col>
                <Col span={10} className="order-detail-order-admin-right">
                  <h3>Thông tin người mua:</h3>
                  <div className="info-user-order-admin">
                    Tên khách hàng: <b>{stateOrder.shippingAddress.fullName}</b>
                    <br />
                    Số điện thoại: <b>{stateOrder.shippingAddress.phone}</b>
                    <br />
                    Thành phố: <b>{stateOrder.shippingAddress.city}</b>
                    <br />
                    Địa chỉ nhận: <b>{stateOrder.shippingAddress.address}</b>
                  </div>
                </Col>
              </Row>
            </div>
          </Loading>
        </Modal>
      </div>
      <div className="chart--order-admin">
        <Modal
          title="Phương thức thanh toán thường đươc sử dụng"
          open={isOpenChart}
          onOk={handleCancelChart}
          onCancel={handleCancelChart}
        >
          <PieChartComponent data={orders?.data} />
        </Modal>
      </div>
    </div>
  );
}
export default AdminOrder;

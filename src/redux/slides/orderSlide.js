import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  orderItems: [],
  orderItemsSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paiAt: "",
  isDelivered: false,
  delivereAt: "",
  isSuccessOrder: false, // Sửa lỗi chính tả
  isErrorOrder: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );
      if (itemOrder) {
        if (orderItem.amount <= orderItem.countInStock) {
          itemOrder.amount += orderItem?.amount;
          state.isSuccessOrder = true;
          message.success("Sản phẩm đã được thêm vào giỏ hàng");
        } else {
          state.isErrorOrder = true;
          message.error("Số lượng sản phẩm trong kho không đủ");
        }
      } else {
        if (orderItem.amount <= orderItem.countInStock) {
          state.orderItems.push(orderItem);
          message.success("Sản phẩm đã được thêm vào giỏ hàng");
        } else {
          message.error("Thao tác thất bại");
        }
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount++;
      if (itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount--;
      if (itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.filter(
        (item) => item?.product !== idProduct
      );
      state.orderItems = itemOrder;
      state.orderItemsSelected = itemOrderSelected;
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;

      const itemOrders = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      const itemOrderSelected = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      state.orderItems = itemOrders;
      state.orderItemsSelected = itemOrderSelected;
    },
    selectedOrder: (state, action) => {
      /// dùng {a} khi trong cái arr đã chứa biến a
      const listChecked = action.payload;
      const orderSelected = [];
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order);
        }
      });
      state.orderItemsSelected = orderSelected;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
} = orderSlice.actions;

export default orderSlice.reducer;

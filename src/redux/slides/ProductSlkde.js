import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  image: "",
  type: "",
  price: "",
  countInStock: "",
  rating: "",
  description: "",
  discount: "",
};

export const productSlide = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateProduct: (state, action) => {
      const {
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        discount,
      } = action.payload;

      state.name = name;
      state.image = image;
      state.type = type;
      state.price = price;
      state.countInStock = countInStock;
      state.rating = rating;
      state.description = description;
      state.discount = discount;
    },
    resetUser: (state) => {
      state.name = "";
      state.image = "";
      state.type = "";
      state.price = "";
      state.countInStock = "";
      state.rating = "";
      state.description = "";
      state.discount = "";
    },
  },
});
// Action creators are generated for each case reducer function
export const { updateProduct, resetProduct } = productSlide.actions;

export default productSlide.reducer;

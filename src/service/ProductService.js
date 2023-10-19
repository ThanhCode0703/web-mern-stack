import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async (search, limit) => {
  // limit = 6;
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_KEY}product/getAll?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_KEY}product/getAll?limit=${limit}`
    );
  }

  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_KEY}product/create`,
    data
  );
  return res.data;
};

export const getDetailProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_KEY}product/get-details/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_KEY}product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_KEY}product/delete-product/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res;
};

export const deleteMultipleProduct = async (ids, access_token) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_KEY}product/delete-multiple-product`,
    ids,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res;
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_KEY}product/get-all-type`
  );
  return res.data;
};

export const getAllProdctType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_KEY}product/detail-all-product?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );

    return res.data;
  }
};

export const getDetailWithName = async (name) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_KEY}product/get-details-with-name/${name}`
  );

  return res.data;
};

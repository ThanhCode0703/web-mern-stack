import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_KEY}/user/sign-in`,
    data
  );
  console.log("res", res.data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_KEY}/user/sign-up`,
    data
  );
  return res.data;
};

export const getDetailUser = async (id, access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_KEY}/user/get-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const refreshToken = async (refreshToken) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_KEY}/user/refresh-token`,
    {},
    {
      headers: {
        token: `Bearer ${refreshToken}`,
      },
    }
  );
  return res;
};

export const logOutUser = async (data) => {
  const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/log-out`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_KEY}/user/update-user/${id}`,
    data
  );
  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_KEY}/user/get-all-users`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteUser = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_KEY}/user/delete-user/${id}`
  );
  return res.data;
};

export const deleteMutipleUsers = async (ids, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_KEY}/user/delete-multiple-user`,
    ids
  );
  return res.data;
};

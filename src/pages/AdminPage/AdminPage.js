import "./AdminPage.css";
import React, { useState } from "react";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  ControlTwoTone,
} from "@ant-design/icons";
import { Menu, Switch } from "antd";
import { getItem } from "../../utils";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";

const items = [
  getItem("", ""),
  getItem("ADMIN", "admin", <ControlTwoTone />),
  getItem("Người dùng", "user", <UserOutlined />),
  getItem("Sản phẩm", "product", <ShoppingCartOutlined />),
  getItem("Đơn hàng", "order", <i className="fa-regular fa-newspaper"></i>),
];
function AdminPage() {
  const [current, setCurrent] = useState("user");
  const [theme, setTheme] = useState("dark");
  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };
  const onClick = ({ key }) => {
    setCurrent(key);
  };
  const renderPage = (current) => {
    switch (current) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      default:
        return;
    }
  };
  return (
    <div className="admin-page-container">
      <div className="menu-item-admin-page">
        <Switch
          className="change-theme-menu"
          checked={theme === "dark"}
          onChange={changeTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        <Menu
          className="menu-itme"
          style={{
            width: 300,
            height: "100vh",
            boxShadow: "1px 1px 2px #ccc",
          }}
          mode="inline"
          defaultSelectedKeys={["user"]}
          defaultOpenKeys={["user"]}
          items={items}
          theme={theme}
          onClick={onClick}
        />
      </div>
      <div className="content-admin-page">{renderPage(current)}</div>
    </div>
  );
}

export default AdminPage;

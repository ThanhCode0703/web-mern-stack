import { Badge, Button, Col, Popover } from "antd";
import "./HeaderComponent.css";
import {
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import { searchProduct } from "../../redux/slides/ProductSlide";

import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserService from "../../service/UserService";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlide";
import { useEffect, useState } from "react";
import Loading from "../../loading/loading";

function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const order = useSelector((state) => state.order);
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    await UserService.logOutUser();
    dispatch(resetUser());
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);

    setUserName(user?.name);
    setLoading(false);
  }, [user.name]);
  const content = (
    <div>
      {user && user?.isAdmin ? (
        <>
          <Button onClick={() => navigate("/profile-user")}>
            Thông tin người dùng
          </Button>
          <br />
          <Button>Đơn hàng của tôi</Button>
          <br />
          <Button onClick={() => navigate("/system/admin")}>
            Quản lý hệ thống
          </Button>
          <br />
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </>
      ) : (
        <>
          <Button onClick={() => navigate("/profile-user")}>
            Thông tin người dùng
          </Button>
          <br />
          <Button>Đơn hàng của tôi</Button>
          <br />
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </>
      )}
    </div>
  );
  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  return (
    <div>
      <WrapperHeader gutter={20}>
        <Col span={6}>
          <WrapperTextHeader>NgocThanhCN20E</WrapperTextHeader>
        </Col>
        <Col span={12}>
          <ButtonInputSearch
            size="large"
            placeholder="input search text "
            onChange={onSearch}
          />
        </Col>
        <Col
          span={6}
          style={{ display: "flex", gap: "30px", alignItems: "center" }}
        >
          <Loading isLoading={loading}>
            {user && user?.name ? (
              <Popover
                placement="bottomLeft"
                title="Menu"
                content={content}
                // arrow={mergedArrow}
                trigger="click"
              >
                <button type="button" className="btn-account">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar}
                      className="avatar-user-header"
                      alt="avatar"
                    />
                  ) : (
                    <i className="fa-regular fa-user" />
                  )}
                  &nbsp; {userName}
                </button>
              </Popover>
            ) : (
              <WrapperHeaderAccount onClick={handleNavigateLogin}>
                <button type="button" className="btn-account">
                  <i className="fa-regular fa-user" />
                  &nbsp;Tài khoản
                </button>
              </WrapperHeaderAccount>
            )}
          </Loading>
          {!isHiddenCart && (
            <div>
              <div className="icon-shopping" onClick={() => navigate("/order")}>
                <Badge count={order?.orderItems.length}>
                  <i className="fa-solid fa-cart-shopping"></i>
                </Badge>
                <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
              </div>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;

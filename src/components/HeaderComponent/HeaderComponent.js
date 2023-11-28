import { Badge, Button, Col, Image, Popover } from "antd";
import "./HeaderComponent.css";
import logo1 from "../../assets/images/logo1.png";
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
import { persistor } from "../../redux/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const order = useSelector((state) => state.order);

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const dispatch = useDispatch();
  const handleLogOut = () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("__paypal_storage__");
    persistor.pause();
    persistor.flush().then(() => {
      return persistor.purge();
    });
    dispatch(resetUser());
    setLoading(false);
    navigate("/");
  };
  useEffect(() => {
    setLoading(true);

    setUserName(user?.name);
    setLoading(false);
  }, [user.name]);
  const content = (
    <div>
      {user?.isAdmin ? (
        <>
          <Button onClick={() => handleClickNavigate("profile")}>
            Thông tin người dùng
          </Button>
          <br />
          <Button onClick={() => handleClickNavigate(`order`)}>
            Đơn hàng của tôi
          </Button>
          <br />
          <Button onClick={() => handleClickNavigate("admin")}>
            Quản lý hệ thống
          </Button>
          <br />
          <Button onClick={() => handleClickNavigate("log-out")}>
            Đăng xuất
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => handleClickNavigate("profile")}>
            Thông tin người dùng
          </Button>
          <br />
          <Button onClick={() => handleClickNavigate("order")}>
            Đơn hàng của tôi
          </Button>
          <br />
          <Button onClick={() => handleClickNavigate("log-out")}>
            Đăng xuất
          </Button>
        </>
      )}
    </div>
  );
  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };
  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "order") {
      navigate("/my-orders", {
        state: {
          id: user?.id,
        },
      });
    } else {
      handleLogOut();
    }
    setIsOpen(false);
  };
  const handleComeBack = () => {
    navigate("/");
  };

  return (
    <div className="header-off-web">
      <WrapperHeader gutter={20}>
        <Col span={6}>
          <WrapperTextHeader onClick={handleComeBack}>
            <div className="logo-header">
              <Image src={logo1} alt="logo-login" preview={false} />
            </div>
          </WrapperTextHeader>
        </Col>
        <Col span={13}>
          <ButtonInputSearch
            size="large"
            // bordered={false}
            placeholder="Nhập tên sản phẩm cần tìm"
            onChange={onSearch}
          />
        </Col>
        <Col
          span={5}
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

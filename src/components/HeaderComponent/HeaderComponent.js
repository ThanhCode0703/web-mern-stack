import { Badge, Col } from "antd";
import "./HeaderComponent.css";
import {
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";

import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";

function HeaderComponent() {
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  return (
    <div>
      <WrapperHeader gutter={20}>
        <Col span={6}>
          <WrapperTextHeader>NgocThanhCN20E</WrapperTextHeader>
        </Col>
        <Col span={12}>
          <ButtonInputSearch size="large" placeholder="input search text " />
        </Col>
        <Col
          span={6}
          style={{ display: "flex", gap: "30px", alignItems: "center" }}
        >
          <WrapperHeaderAccount onClick={handleNavigateLogin}>
            <button type="button" className="btn-account">
              <i className="fa-regular fa-user" />
              &nbsp;Tài khoản
            </button>
          </WrapperHeaderAccount>
          <div>
            <div className="icon-shopping">
              <Badge count={4}>
                <i className="fa-solid fa-cart-shopping"></i>
              </Badge>
              <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
            </div>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;

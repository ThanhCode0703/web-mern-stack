import InputForm from "../../../components/InputForm/InputForm";
import React from "react";
import imglogin from "../../../assets/images/logo-login.png";
import { Image } from "antd";

function SignUpPage() {
  return (
    <div className="container-signin">
      <div className="row wrapper-signin">
        <div className="wrapper-container-left col-7">
          <h1>Xin Chào, </h1>
          <p> Đăng ký ngay - Quà trao tay</p>
          <InputForm />
          <p>
            Bạn đã có tài khoản?{" "}
            <span className="sign-in-with-email">Đăng nhập</span>
          </p>
        </div>
        <div className="wrapper-container-right col-5 image-login">
          <Image src={imglogin} alt="logo-login" preview={false} />
          <h4 className="Content-login">Mua sắm tại Tiki</h4>
          <span className="Content-login1">Siêu ưu đãi mỗi ngày</span>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;

import React, { useEffect, useState } from "react";
import "./SignInPage.css";
import InputForm from "../../../components/InputForm/InputForm";
import imglogin from "../../../assets/images/logo-login.png";
import { Form, Image, message } from "antd";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { UserMutationHook } from "../../../hook/UseMutationHook";
import { loginUser } from "../../../service/UserService";
function SignInPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleNavigateSignup = () => {
    navigate("/sign-up");
  };
  //đăng nhập tài khoản
  const mutation = UserMutationHook((data) => loginUser(data));
  const { isSuccess } = mutation;
  const [email, setEmail] = useState("");
  //password
  const [password, setPassword] = useState("");
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };
  //Đăng nhập
  const handleSignin = () => {
    mutation.mutate({ email, password });
  };
  //  useEffect(()=>{
  //   if(isSuccess){
  //     message.success,
  //     navigate('/Ho')
  //   }
  //  })
  return (
    <div className="container-signin">
      <div className="row wrapper-signin">
        <div className="wrapper-container-left col-7">
          <h1>Xin Chào, </h1>
          <p>Đăng nhập hoặc Tạo tài khoản</p>
          <Form className="form-input-sign-in">
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <InputForm
                placeholder="Email"
                onChange={(e) => handleOnChangeEmail(e)}
              />
            </Form.Item>
            <div className="hide-show-password">
              <span
                className="hide-show-password-span"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                <i
                  className={
                    isShowPassword
                      ? "fa-regular fa-eye-slash"
                      : "fa-regular fa-eye-slash"
                  }
                ></i>
              </span>
              <Form.Item>
                <InputForm
                  placeholder="Mật khẩu"
                  type={isShowPassword ? "text" : "password"}
                  onChange={(e) => handleOnChangePassword(e)}
                />
              </Form.Item>
            </div>
            <ButtonComponent
              disabled={!email.length || !password.length}
              className="btn-sign-in"
              textButton="Đăng nhập"
              onClick={handleSignin}
            />
          </Form>
          <p className="sign-in-with-email">Quên mật khẩu</p>
          <p>
            Chưa có tài khoản?{" "}
            <span className="sign-in-with-email" onClick={handleNavigateSignup}>
              Đăng kí
            </span>
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

export default SignInPage;

import React, { useEffect, useState } from "react";
import "./SignInPage.css";
import InputForm from "../../../components/InputForm/InputForm";
import imglogin from "../../../assets/images/logo-login.png";
import { Form, Image } from "antd";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { UserMutationHook } from "../../../hook/UseMutationHook";
import * as UserService from "../../../service/UserService";
import Loading from "../../../loading/loading";
import * as message from "../../../message/message";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slides/userSlide";
function SignInPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleNavigateSignup = () => {
    navigate("/sign-up");
  };
  //đăng nhập tài khoản
  const mutation = UserMutationHook((data) => UserService.loginUser(data));
  const { data, isLoading, isSuccess } = mutation;

  const [email, setEmail] = useState("");
  //password
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (isSuccess) {
      message.success();
      navigate("/");
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token);

        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    }
  }, [isSuccess]);
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
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
            <Loading isLoading={isLoading}>
              <ButtonComponent
                disabled={!email.length || !password.length}
                className="btn-sign-in"
                textButton="Đăng nhập"
                onClick={handleSignin}
              />
            </Loading>
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

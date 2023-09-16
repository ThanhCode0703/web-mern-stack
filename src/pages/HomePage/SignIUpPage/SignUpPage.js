import InputForm from "../../../components/InputForm/InputForm";
import React, { useEffect, useState } from "react";
import imglogin from "../../../assets/images/logo-login.png";
import { Form, Image, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../../service/UserService";
import {
  RollbackOutlined,
  EyeInvisibleFilled,
  EyeFilled,
} from "@ant-design/icons";
import { UserMutationHook } from "../../../hook/UseMutationHook";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import "../SignInPage/SignInPage.css";
import socialItem from "../../../assets/images/socail-item/index";
function SignUpPage() {
  //lịch sử
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  //đăng ký tài khoản
  const mutation = UserMutationHook((data) => signupUser(data));
  const { isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success();
      navigate("/sign-in");
    }
    //  else if (isError) {
    //   message.error();
    // }
  });
  //  [isSuccess, isError]);

  //xử lý dữ liệu trong form
  //Email
  const [email, setEmail] = useState("");
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  //password
  const [password, setPassword] = useState("");
  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };
  //confirm password
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleOnChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };
  //tên hiển thị
  const [name, setName] = useState("");
  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  //số điện thoại
  const [phone, setPhoneNumber] = useState("");
  const handleOnchangePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };
  //Đăng ký
  const handleSignUp = () => {
    mutation.mutate({ name, email, password, confirmPassword, phone });
  };
  return (
    <div className="container-signin">
      <div className="row wrapper-signin">
        <div className="wrapper-container-left col-7">
          <h1>Xin Chào, </h1>
          <p> Đăng ký ngay - Quà trao tay</p>
          {/* <InputForm /> */}
          <Form className="form-input-sign-in">
            <InputForm
              placeholder="Tên hiển thị.."
              type="text"
              onChange={(e) => handleOnchangeName(e)}
            />
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
                {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </span>
              <Form.Item>
                <InputForm
                  placeholder="Mật khẩu"
                  type={isShowPassword ? "text" : "password"}
                  onChange={(e) => handleOnChangePassword(e)}
                />
              </Form.Item>
            </div>
            <div className="hide-show-confirm-password">
              <InputForm
                placeholder="Nhập lại mật khẩu"
                type={isShowConfirmPassword ? "text" : "password"}
                name="re-password"
                onChange={(e) => handleOnChangeConfirmPassword(e)}
              />
              <span
                className="hide-show-confirm-password-span"
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              >
                {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </span>
            </div>
            <InputForm
              placeholder="Số điện thoại"
              type="text"
              onChange={(e) => handleOnchangePhoneNumber(e)}
            />
          </Form>
          <ButtonComponent
            disabled={
              !email.length ||
              !password.length ||
              !confirmPassword.length ||
              !name.length ||
              !phone.length
            }
            onClick={handleSignUp}
            className="btn-sign-in"
            textButton="Đăng ký"
          />
          <Link to="/sign-in">
            <ButtonComponent
              className="back-to-sign-in"
              icon={<RollbackOutlined />}
              textButton="Trở lại trang đăng nhập"
              to="/sign-in"
            />
          </Link>
          <div className="footer-left-sign-in">
            <div className="social-heading-sign-in-page">
              <span>Hoặc tiếp tục bằng:</span>
              <ul className="social-list-item-sign-in">
                {socialItem.map((social, index) => (
                  <li key={index} className="social-item-sign-in">
                    <img
                      className="image-social-item-sign-in"
                      src={social}
                      alt="social item"
                    />
                  </li>
                ))}
              </ul>
              <div>
                Bạn đã có tài khoản?{" "}
                <span className="sign-in-with-email">Đăng nhập</span>
              </div>
            </div>
          </div>
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

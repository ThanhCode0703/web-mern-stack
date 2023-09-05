import React from "react";
import "./InputForm.css";
function InputForm() {
  return (
    <div className="container-input">
      <input type="text" className="form-control" placeholder="Email" />
      <input type="text" className="form-control" placeholder="Mật Khẩu" />
      <button type="button" className="btn btn-lg button-login">
        Đăng nhập
      </button>
    </div>
  );
}

export default InputForm;

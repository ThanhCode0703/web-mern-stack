import { message } from "antd";

const success = (mes = "Thành công") => {
  message.success(mes);
};

const error = (mes = "Có lỗi xẩy ra") => {
  message.error(mes);
};

const warning = (mes = "Xuất hiện sự cố") => {
  message.warning(mes);
};

export { success, error, warning };

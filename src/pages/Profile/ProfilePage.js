import { Input, Upload } from "antd";
import * as message from "../../message/message";
import { UploadOutlined } from "@ant-design/icons";
import "./ProfilePage.css";
import { useEffect, useState } from "react";
import Loading from "../../loading/loading";
import { UserMutationHook } from "../../hook/UseMutationHook";
import * as UserService from "../../service/UserService";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";
import { getBase64 } from "../../../src/utils";

function ProfilePage() {
  const user = useSelector((state) => state.user);
  const [detail, setDetail] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const dispatch = useDispatch();
  const mutation = UserMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, access_token, rests);
  });
  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    setDetail({
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      avatar: user?.avatar,
    });
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError, isLoading]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token);

    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  // lỗi local bỏ qua nó đi, bỏ qua lỗi, dùng hàm để lưu chuỗi base 64 lại
  //avatar
  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    const copy = { ...detail };
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setDetail({
      ...copy,
      avatar: file.preview,
    });
  };
  const handleOnChange = (e) => {
    let copyState = { ...detail };
    copyState[e.target.name] = e.target.value;
    setDetail({
      ...copyState,
    });
  };
  //update
  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      name: detail.name,
      email: detail.email,
      phone: detail.phone,
      address: detail.address,
      avatar: detail.avatar,
      access_token: user?.access_token,
    });
  };

  return (
    <div className="container-profile-user">
      <h1 className="profile-user-text-h1">Thông tin người dùng</h1>
      <Loading isLoading={isLoading}>
        <div className="wrapper-content-profile-user">
          <div className="wrapper-input-profile-user">
            <label htmlFor="name-user" className="label-profile-user">
              Tên người dùng:
            </label>
            <Input
              name="name"
              id="name-user"
              className="input-profile-user"
              value={detail.name}
              onChange={(e) => handleOnChange(e)}
            />
          </div>
          <div className="wrapper-input-profile-user">
            <label htmlFor="email-user" className="label-profile-user">
              Email:
            </label>
            <Input
              id="email-user"
              name="email"
              className="input-profile-user"
              value={detail.email}
              onChange={(e) => handleOnChange(e)}
            />
          </div>
          <div className="wrapper-input-profile-user">
            <label htmlFor="phone-user" className="label-profile-user">
              Phone:
            </label>
            <Input
              id="phone-user"
              className="input-profile-user"
              value={detail.phone}
              name="phone"
              onChange={(e) => handleOnChange(e)}
            />
          </div>
          <div className="wrapper-input-profile-user">
            <label htmlFor="address-user" className="label-profile-user">
              Address:
            </label>
            <Input
              id="address-user"
              className="input-profile-user"
              value={detail.address}
              name="address"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="wrapper-input-profile-user">
            {" "}
            <label htmlFor="avatar-user" className="label-profile-user">
              Avatar:
            </label>
            <Upload
              maxCount={1}
              className="upload-file-image-profile-user"
              onChange={handleOnChangeAvatar}
            >
              <ButtonComponent
                icon={<UploadOutlined />}
                textButton="Tải ảnh lên"
              ></ButtonComponent>
            </Upload>
            {/* <Input type="file" onChange={handleOnChangeAvatar} /> */}
            {detail.avatar && (
              <img
                src={detail.avatar}
                alt="avatar"
                className="user-avatar-profile-user"
              />
            )}
          </div>
          <ButtonComponent
            className="btn-update"
            textButton="Cập nhật"
            onClick={handleUpdate}
          />
        </div>
      </Loading>
    </div>
  );
}

export default ProfilePage;

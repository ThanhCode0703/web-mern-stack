import { Form, Space, Upload } from "antd";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ModalComponent from "../Modal/ModalComponent";
import TableComponent from "../Table/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../../loading/loading";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { getBase64 } from "../../utils";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { UserMutationHook } from "../../hook/UseMutationHook";
import * as message from "../../message/message";
import {
  SearchOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import * as UserService from "../../service/UserService";
import "./AdminUser.css";

function AdminUser() {
  const [form] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);

  const searchInput = useRef(null);
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });
  const [stateUserDetail, setStateUserDetail] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });

  //create sản phẩm
  const mutation = UserMutationHook((data) => {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      isAdmin,
      avatar,
      address,
    } = data;
    const res = UserService.signupUser({
      name,
      email,
      password,
      confirmPassword,
      phone,
      isAdmin,
      avatar,
      address,
    });

    return res;
  });

  const mutationUpdate = UserMutationHook((data) => {
    const { id, token } = data;

    const res = UserService.updateUser(id, token, data);

    return res;
  });

  const mutationDelete = UserMutationHook((data) => {
    const { id, token, ...rests } = data;

    const res = UserService.deleteUser(id, token, { ...rests });

    return res;
  });

  const mutationDeleteMany = UserMutationHook((data) => {
    const { token, ids } = data;

    const res = UserService.deleteMultipleUsers(ids, token);

    return res;
  });

  const getAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token);

    return res;
  };

  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDelete,
    isLoading: isLoadingDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
  } = mutationDelete;
  const {
    data: dataDeleteMany,
    isLoading: isLoadingDeleteMany,
    isSuccess: isSuccessDeleteMany,
    isError: isErrorDeleteMany,
  } = mutationDeleteMany;
  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
  });
  const { isLoading: isLoadingUsers, data: users } = queryUser;

  const fetchGetDetailsUser = async () => {
    const res = await UserService.getDetailUser(
      rowSelected,
      user?.access_token
    );
    if (res?.data) {
      setStateUserDetail({
        name: res?.data?.name,
        email: res?.data?.email,
        password: res?.data?.password,
        isAdmin: res?.data?.isAdmin,
        phone: res?.data?.phone,
        address: res?.data?.address,
        avatar: res?.data?.avatar,
      });
    }
    setIsLoadingUpdate(false);
  };
  useEffect(() => {
    form.setFieldValue();
  }, [form, stateUserDetail]);
  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  const handleEditUser = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser();
    }
    setIsOpenDrawer(true);
  };
  const renderUserActions = () => {
    return (
      <div className="actions-user-admin-page">
        <ButtonComponent
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEditUser}
        />
        &nbsp;
        <ButtonComponent
          danger
          icon={<DeleteOutlined />}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };
  //dữ liệu để đổ vào bảng
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 15,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => clearFilters && handleReset(clearFilters)}
          >
            <i class="fa-solid fa-arrow-rotate-left"></i> Reset
          </button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Địa chỉ email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      filters: [
        {
          text: `Admin`,
          value: "ADMIN",
        },
        {
          text: `User`,
          value: "USER",
        },
      ],
      onFilter: (value, record) => {
        if (value === "ADMIN") return record.isAdmin === "ADMIN";
        if (value === "USER") return record.isAdmin === "USER";
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: renderUserActions,
    },
  ];

  const dataTable =
    users?.data &&
    users?.data.length &&
    users?.data.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "true" : "false",
      };
    });
  //truyền dữ liệu
  const handleOnChange = (e) => {
    let copyState = { ...stateUser };
    setStateUser({
      ...copyState,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChangeDetails = (e) => {
    let copyStateDetail = { ...stateUserDetail };

    setStateUserDetail({
      ...copyStateDetail,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isErrorDelete) {
      message.error();
    }
  }, [isSuccessDelete]);

  useEffect(() => {
    if (isSuccessDeleteMany && dataDeleteMany?.status === "OK") {
      message.success();
    } else if (isErrorDeleteMany) {
      message.error();
    }
  }, [isSuccessDeleteMany]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetail({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      isAdmin: false,
      avatar: "",
      address: "",
    });

    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteUser = () => {
    alert("xóa");
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleDeleteMultipleUser = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      isAdmin: false,
      avatar: "",
      address: "",
    });

    form.resetFields();
  };
  const onFinish = () => {
    mutation.mutate(...stateUser, {
      onSettled: () => {
        queryUser.refetch();
      },
    });
  };

  //image-user
  const handleOnChangeImageUser = async ({ fileList }) => {
    let copyState = { ...stateUser };
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUser({
      ...copyState,
      avatar: file.preview,
    });
  };
  const handleOnChangeImageUserDetails = async ({ fileList }) => {
    let copyStateDetail = { ...stateUserDetail };
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetail({
      ...copyStateDetail,
      avatar: file.preview,
    });
  };
  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetail,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  return (
    <div className="user-admin-management-container">
      <h1> Quản lý người dùng </h1>
      <button
        type="button"
        className="btn btn-outline-success"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="fa-solid fa-user-plus"></i> Thêm
      </button>
      <div className="table-content-management-product">
        <TableComponent
          columns={columns}
          isLoading={isLoadingUsers}
          data={dataTable}
          handleDeleteMany={handleDeleteMultipleUser}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              }, // click row
            };
          }}
        />
      </div>

      <ModalComponent
        forceRender
        title="Tạo người dùng mới"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={isLoading}>
          <Form
            form={form}
            name="formUser"
            className="create-User-form"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="on"
          >
            <Form.Item
              label="Tên của bạn"
              valuePropName="field"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên của bạn!",
                },
              ]}
            >
              <InputComponent
                value={stateUser.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ email!",
                },
              ]}
            >
              {" "}
              <InputComponent
                value={stateUser.email}
                onChange={handleOnChange}
                name="email"
              />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <InputComponent
                value={stateUser.password}
                onChange={handleOnChange}
                name="password"
              />
            </Form.Item>
            <Form.Item
              label="Nhập lại mật khẩu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu!",
                },
              ]}
            >
              <InputComponent
                value={stateUser.confirmPassword}
                onChange={handleOnChange}
                name="confirmPassword"
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
              ]}
            >
              <InputComponent
                value={stateUser.phone}
                onChange={handleOnChange}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ!",
                },
              ]}
            >
              <InputComponent
                value={stateUser.address}
                onChange={handleOnChange}
                name="address"
              />
            </Form.Item>

            <Form.Item label="Ảnh đại diện">
              <Upload
                maxCount={1}
                className="upload-file-avatar"
                onChange={handleOnChangeImageUser}
              >
                <ButtonComponent
                  icon={<UploadOutlined />}
                  textButton="Tải ảnh lên"
                ></ButtonComponent>
              </Upload>
              {stateUser.avatar && (
                <img
                  src={stateUser.avatar}
                  alt="avatar"
                  className="user-image-management"
                />
              )}
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <ButtonComponent
                type="primary"
                htmlType="submit"
                onClick={onFinish}
                className="btn-submit-create-user"
                textButton="Tạo người dùng"
              ></ButtonComponent>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      {/* edit */}
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="40%"
      >
        <Loading isLoading={isLoadingUpdated}>
          <Form
            form={form}
            name="formUserDetail"
            className="edit-User-form"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="on"
            // onFinish={onFinish}
          >
            <Form.Item label="Tên của bạn" valuePropName="field">
              <InputComponent
                value={stateUserDetail.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item label="Địa chỉ email">
              {" "}
              <InputComponent
                value={stateUserDetail.email}
                onChange={handleOnChangeDetails}
                name="email"
              />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <InputComponent
                value={stateUserDetail.phone}
                onChange={handleOnChangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item label="Địa chỉ">
              <InputComponent
                value={stateUserDetail.address}
                onChange={handleOnChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item label="Ảnh đại diện">
              <Upload
                maxCount={1}
                className="upload-file-avatar"
                name="avatar"
                onChange={handleOnChangeImageUserDetails}
              >
                <ButtonComponent
                  icon={<UploadOutlined />}
                  textButton="Tải ảnh lên"
                ></ButtonComponent>
              </Upload>
              {stateUserDetail.avatar && (
                <img
                  src={stateUserDetail.avatar}
                  alt="avatar"
                  className="user-image-management"
                />
              )}
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <ButtonComponent
                type="primary"
                // htmlType="submit"
                onClick={onUpdateUser}
                className="btn-submit-create-user"
                textButton="Cập nhập"
              ></ButtonComponent>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        // forceRender
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        // onOK={handleDeleteProduct}

        footer={null}
      >
        <Loading isLoading={isLoadingDelete}>
          <div>Bạn có chắc muốn xóa tài khoản này không??</div>

          <div className="btn-delete">
            <button className="btn btn-danger" onClick={handleDeleteUser}>
              Xóa tài khoản
            </button>
          </div>
        </Loading>
      </ModalComponent>
    </div>
  );
}

export default AdminUser;

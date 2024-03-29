import TableComponent from "../Table/TableComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useEffect, useRef, useState } from "react";
import * as message from "../../message/message";
import { toast } from "react-toastify";
import {
  SearchOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./AdminProduct.css";
import { getBase64, renderOptions } from "../../utils";
import ModalComponent from "../Modal/ModalComponent";
import { Form, Select, Space, Upload } from "antd";
import { useSelector } from "react-redux";
import * as ProductService from "../../service/ProductService";
import { UserMutationHook } from "../../hook/UseMutationHook";
import InputComponent from "../InputComponent/InputComponent";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../loading/loading";
import DrawerComponent from "../DrawerComponent/DrawerComponent";

function AdminProduct() {
  const [form] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeSelect, setTypeSelect] = useState("");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);

  const searchInput = useRef(null);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    type: "",
    description: "",
    rating: "",
    image: "",
    countInStock: "",
    discount: "",
  });
  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    type: "",
    description: "",
    rating: "",
    image: "",
    countInStock: "",
    discount: "",
  });

  //create sản phẩm
  const mutation = UserMutationHook((data) => {
    const {
      name,
      price,
      type,
      description,
      rating,
      image,
      countInStock,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      type,
      description,
      rating,
      image,
      countInStock,
      discount,
    });

    return res;
  });

  const mutationUpdate = UserMutationHook((data) => {
    const { id, token } = data;

    const res = ProductService.updateProduct(id, token, data);

    return res;
  });

  const mutationDelete = UserMutationHook((data) => {
    const { id, token, ...rests } = data;

    const res = ProductService.deleteProduct(id, token, { ...rests });

    return res;
  });

  const mutationDeleteMultipleProducts = UserMutationHook((data) => {
    const { token, ...ids } = data;

    const res = ProductService.deleteMultipleProduct(ids, token);

    return res;
  });

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct();

    return res;
  };
  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        type: res?.data?.type,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
        sold: res?.data?.sold,
      });
    }
    setIsLoadingUpdate(false);
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

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
    data: dataDeleteMultipleProducts,
    isLoading: isLoadingDeleteMultipleProducts,
    isSuccess: isSuccessDeleteMultipleProducts,
    isError: isErrorDeleteMultipleProducts,
  } = mutationDeleteMultipleProducts;
  const { data, isLoading, isSuccess, isError } = mutation;
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const { isLoading: isLoadingProducts, data: products } = queryProduct;
  useEffect(() => {
    form.setFieldsValue();
  }, [form, stateProductDetails]);
  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  const handleEditProduct = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct();
    }
    setIsOpenDrawer(true);
  };

  const renderAction = () => {
    return (
      <div className="actions-product-admin-page">
        <ButtonComponent
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEditProduct}
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
            className="btn btn-primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => clearFilters && handleReset(clearFilters)}
          >
            <i className="fa-solid fa-arrow-rotate-left"></i> Reset
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
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: `Từ 5.000.000 VNĐ`,
          value: `>=`,
        },
        {
          text: `Nhỏ hơn 5.000.000 VNĐ`,
          value: `<=`,
        },
      ],
      onFilter: (value, record) => {
        if (value === `>=`) return record.price >= 5000000;
        if (value === `<=`) return record.price <= 5000000;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: `từ 3 sao trở lên`,
          value: `>=`,
        },
        {
          text: `dưới 3 sao`,
          value: `<=`,
        },
      ],
      onFilter: (value, record) => {
        if (value === `>=`) return record.rating >= 3;
        if (value === `<=`) return record.rating <= 3;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    products?.data &&
    products?.data.length &&
    products?.data.map((product) => {
      return { ...product, key: product._id };
    });
  //truyền dữ liệu
  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChangeDetails = (e) => {
    let copyState = { ...stateProductDetails };
    copyState[e.target.name] = e.target.value;

    setStateProductDetails({
      ...copyState,
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
    if (
      isSuccessDeleteMultipleProducts &&
      dataDeleteMultipleProducts?.status === "OK"
    ) {
      message.success();
      handleCancel();
    } else if (isErrorDeleteMultipleProducts) {
      message.error();
    }
  }, [isSuccessDeleteMultipleProducts]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      type: "",
      description: "",
      rating: "",
      image: "",
      countInStock: "",
      discount: "",
    });

    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
    toast.success("Xóa sản phẩm thành công!");
  };

  const handleDeleteMultipleProducts = (ids) => {
    mutationDeleteMultipleProducts.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      type: "",
      description: "",
      rating: "",
      image: "",
      countInStock: "",
      discount: "",
    });

    form.resetFields();
  };
  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  //image-product
  const handleOnChangeImageProduct = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };
  const handleOnChangeImageProductDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  //loại sản phẩm
  const handleOnchangeSelect = (value) => {
    if (value !== "add-type") {
      setStateProduct({
        ...stateProduct,
        type: value,
      });
    } else {
      setTypeSelect(value);
    }
  };

  return (
    <div className="product-admin-management-container">
      <h1> Quản lý Sản Phẩm </h1>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="fa-solid fa-cart-plus"></i> Thêm
      </button>
      <div className="table-content-management-product">
        <TableComponent
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          handleDeleteMany={handleDeleteMultipleProducts}
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
        title="Tạo sản phẩm "
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={isLoading}>
          <Form
            form={form}
            name="formProduct"
            className="create-product-form"
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
            onFinish={onFinish}
          >
            <Form.Item
              label="Tên sản phẩm"
              // name="name"
              valuePropName="field"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn loại sản phẩm!",
                },
              ]}
              label="Loại sản phẩm"
              // name="type"
            >
              <Select
                // name="type"
                value={stateProduct.type}
                onChange={handleOnchangeSelect}
                style={{
                  width: 200,
                }}
                options={renderOptions(typeProduct?.data?.data)}
              />
              {typeSelect === "add-type" && (
                <InputComponent
                  value={stateProduct.type}
                  onChange={handleOnChange}
                  name="type"
                />
              )}
            </Form.Item>
            <Form.Item
              label="Giá"
              // name="price"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              // name="description"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="giảm giá"
              // name="discount"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá giảm của sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnChange}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Số lượng"
              // name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số sản phẩm có trong kho!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnChange}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item label="Ảnh">
              <Upload
                maxCount={1}
                name="image"
                className="upload-file-image-product"
                onChange={handleOnChangeImageProduct}
              >
                <ButtonComponent
                  icon={<UploadOutlined />}
                  textButton="Tải ảnh lên"
                ></ButtonComponent>
              </Upload>
              {stateProduct.image && (
                <img
                  src={stateProduct.image}
                  alt="productimage"
                  className="product-image-management"
                />
              )}
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              // name="rating"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số sao của sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
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
                className="btn-submit-create-product"
                textButton="Tạo sản phẩm"
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
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            form={form}
            name="basic"
            className="create-product-form"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 19,
            }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="on"
            // onFinish={onFinishDetails}
          >
            <Form.Item
              label="Tên sản phẩm"
              // name="name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.name}
                onChange={(e) => handleOnChangeDetails(e)}
                name="name"
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn loại sản phẩm!",
                },
              ]}
              label="Loại sản phẩm"
              // name="type"
            >
              <InputComponent
                value={stateProductDetails["type"]}
                onChange={handleOnChangeDetails}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Giá"
              // name="price"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnChangeDetails}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              // name="description"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="giảm giá"
              // name="discount"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá giảm của sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnChangeDetails}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Số lượng"
              // name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số sản phẩm có trong kho!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnChangeDetails}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item label="Ảnh">
              <Upload
                maxCount={1}
                name="image"
                className="upload-file-image-product"
                onChange={handleOnChangeImageProductDetails}
              >
                <ButtonComponent
                  icon={<UploadOutlined />}
                  textButton="Tải ảnh lên"
                ></ButtonComponent>
              </Upload>
              {stateProductDetails.image && (
                <img
                  src={stateProductDetails.image}
                  alt="productimage"
                  className="product-image-management"
                />
              )}
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              // name="rating"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số sao của sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnChangeDetails}
                name="rating"
              />
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
                onClick={onUpdateProduct}
                className="btn-submit-create-product"
                textButton="Cập nhập"
              ></ButtonComponent>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        forceRender
        title="Xóa sản phẩm "
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        // onOK={handleDeleteProduct}

        footer={null}
      >
        <Loading isLoading={isLoadingDelete}>
          <div>Bạn có chắc muốn xóa sản phẩm này không??</div>

          <div className="btn-delete">
            <button className="btn btn-danger" onClick={handleDeleteProduct}>
              Xóa sản phẩm
            </button>
          </div>
        </Loading>
      </ModalComponent>
    </div>
  );
}

export default AdminProduct;

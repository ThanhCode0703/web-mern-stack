import TableComponent from "../Table/TableComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useEffect, useRef, useState } from "react";
import * as message from "../../message/message";
import { UploadOutlined } from "@ant-design/icons";
import "./AdminProduct.css";
import { getBase64, renderOptions } from "../../utils";
import ModalComponent from "../Modal/ModalComponent";
import { Form, Input, Select, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as ProductService from "../../service/ProductService";
import { UserMutationHook } from "../../hook/UseMutationHook";
import { updateProduct } from "../../redux/slides/ProductSlkde";
import InputComponent from "../InputComponent/InputComponent";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../loading/loading";

function AdminProduct() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const product = useSelector((state) => state.product);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [typeProduct, setTypeProduct] = useState([]);
  const [typeSelect, setTypeSelect] = useState("");
  const searchInput = useRef(null);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: 0,
    type: "",
    description: "",
    rating: 0,
    image: "",
    countInStock: "",
    discount: 0,
  });
  const [stateProductDetail, setStateProductDetail] = useState({
    name: "",
    price: 0,
    type: "",
    description: "",
    rating: 0,
    image: "",
    countInStock: "",
    discount: 0,
  });
  const dispatch = useDispatch();
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

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct();

    return res;
  };
  const { data, isLoading, isSuccess, isError } = mutation;

  //truyền dữ liệu
  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: 0,
      type: "",
      description: "",
      rating: 0,
      image: "",
      countInStock: "",
      discount: 0,
    });

    form.resetFields();
  };
  const onFinish = () => {
    mutation.mutate(stateProduct, {
      // onSettled: () => {
      //   queryProduct.refetch();
      // },
    });
    handleCancel();
  };

  //lấy loại sản phầm
  const fetchGetAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProduct(res.data);
    }
    return res;
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
  const handleOnChangeImageProductDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetail({
      ...stateProductDetail,
      image: file.preview,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailsProduct(product?.id);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError, isLoading]);
  const handleGetDetailsProduct = async (id) => {
    const res = await ProductService.getDetailProduct(id);

    dispatch(updateProduct({ ...res?.data }));
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

  // //query
  // const queryTypeProduct = useQuery(["type-product"], fetchGetAllTypeProduct);
  // const queryProduct = useQuery(["products"], getAllProduct);
  // const { isLoading: isLoadingProduct, data: products } = queryProduct;
  // const dataProduct =
  //   products?.data?.length &&
  //   products?.data?.map((product) => {
  //     return { ...product, key: product._id };
  //   });
  // useEffect(() => {
  //   if (isSuccess && data?.status === "Ok") {
  //     message.success();
  //     handleCancel();
  //   } else if (isError) {
  //     message.error();
  //   }
  // }, [isSuccess]);
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
      <div className="table-content-management-product">TableComponent</div>

      <ModalComponent
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
              name="name"
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
              name="type"
            >
              <Select
                name="type"
                value={typeSelect}
                onChange={handleOnchangeSelect}
                style={{
                  width: 200,
                }}
                options={renderOptions(typeProduct)}
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
              name="price"
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
              name="description"
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
              name="discount"
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
              name="countInStock"
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
              name="rating"
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
    </div>
  );
}

export default AdminProduct;

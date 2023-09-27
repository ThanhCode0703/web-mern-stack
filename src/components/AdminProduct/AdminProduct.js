import TableComponent from "../Table/TableComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useEffect, useState } from "react";
import * as message from "../../message/message";
import { UploadOutlined } from "@ant-design/icons";
import "./AdminProduct.css";
import ModalComponent from "../Modal/ModalComponent";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as ProductService from "../../service/ProductService";
import { UserMutationHook } from "../../hook/UseMutationHook";
import { updateProduct } from "../../redux/slides/ProductSlkde";

function AdminProduct() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const product = useSelector((state) => state.product);
  const [detail, setDetail] = useState({
    name: "",
    image: "",
    type: "",
    price: "",
    countInStock: "",
    rating: "",
    description: "",
    discount: "",
  });

  const dispatch = useDispatch();
  const mutation = UserMutationHook((data) => {
    const { id, ...rests } = data;
    ProductService.updateProduct(id, rests);
  });
  const { data, isLoading, isSuccess, isError } = mutation;
  const handleOnChange = (e) => {
    let copyState = { ...detail };
    copyState[e.target.name] = e.target.value;
    setDetail({
      ...copyState,
    });
  };
  useEffect(() => {
    setDetail({
      name: product?.name,
      image: product?.image,
      type: product?.type,
      price: product?.price,
      countInStock: product?.countInStock,
      rating: product?.rating,
      description: product?.description,
      discount: product?.discount,
    });
  }, [product]);

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
        onCancel={(e) => handleOnChange(e)}
      >
        <form>
          <div className="wrapper-input-add-product">
            <label htmlFor="name-product" className="label-add-product">
              Tên sản phẩm:
            </label>
            <Input
              name="name"
              id="name-product"
              className="input-add-product"
              value={detail.name}
              onChange={(e) => handleOnChange(e)}
              rules={[
                { required: true, message: "Please input your name product!" },
              ]}
            />
          </div>
          <div className="wrapper-input-add-product">
            <label htmlFor="type-product" className="label-add-product">
              Loại:
            </label>
            <Input
              name="type"
              id="type-product"
              className="input-add-product"
              value={detail.type}
              onChange={(e) => handleOnChange(e)}
              rules={[
                { required: true, message: "Please input your type product!" },
              ]}
            />
          </div>
          <div className="wrapper-input-add-product">
            <label htmlFor="price-product" className="label-add-product">
              Giá:
            </label>
            <Input
              name="price"
              id="price-product"
              className="input-add-product"
              value={detail.price}
              onChange={(e) => handleOnChange(e)}
              rules={[
                { required: true, message: "Please input your price product!" },
              ]}
            />
          </div>
          <div className="wrapper-input-add-product">
            <label htmlFor="countInStock-product" className="label-add-product">
              Số lượng còn lại trong kho:
            </label>
            <Input
              name="countInStock"
              id="countInStock-product"
              className="input-add-product"
              value={detail.countInStock}
              onChange={(e) => handleOnChange(e)}
              rules={[
                {
                  required: true,
                  message: "Please input your countInStock product!",
                },
              ]}
            />
          </div>
          <div className="wrapper-input-add-product">
            <label htmlFor="rating-product" className="label-add-product">
              Đánh giá:
            </label>
            <Input
              name="rating"
              id="rating-product"
              className="input-add-product"
              value={detail.rating}
              onChange={(e) => handleOnChange(e)}
              rules={[
                {
                  required: true,
                  message: "Please input your rating product!",
                },
              ]}
            />
          </div>
          <div className="wrapper-input-add-product">
            <label htmlFor="description-product" className="label-add-product">
              Mô tả:
            </label>
            <Input
              name="description"
              id="description-product"
              className="input-add-product"
              value={detail.description}
              onChange={(e) => handleOnChange(e)}
            />
          </div>
          <div className="wrapper-input-add-product">
            <label htmlFor="discount-product" className="label-add-product">
              Giảm giá:
            </label>
            <Input
              name="discount"
              id="discount-product"
              className="input-add-product"
              value={detail.discount}
              onChange={(e) => handleOnChange(e)}
            />
          </div>
        </form>
      </ModalComponent>
    </div>
  );
}

export default AdminProduct;

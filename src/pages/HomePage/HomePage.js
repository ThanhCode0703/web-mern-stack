import slogan from "../../assets/images/slogan.png";
import React, { useEffect } from "react";
import "./HomePage.css";
import CardComponent from "../../components/CardComponent/CardComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../service/ProductService";
import { useSelector } from "react-redux";
import { useState } from "react";
import Loading from "../../loading/loading";
import useDebounce from "../../hook/useDebounce";
import { useNavigate } from "react-router-dom";
import { Image } from "antd";

function HomePage() {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/product");
  };
  return (
    <Loading isLoading={isLoading || loading}>
      <div className="container-homepage">
        <div className="wrapper-logo-product-homepage">
          <Image src={slogan} alt="logo-login" preview={false} />
        </div>
        <div className="wrapper-container-homepage">
          <div className="wrapper-card-component">
            {products?.data?.map((product) => {
              return (
                <div key={product._id}>
                  <CardComponent
                    countInStock={product.countInStock}
                    description={product.description}
                    discount={product.discount}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    sold={product.sold}
                    id={product._id}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="wrapper-button-component">
          <ButtonComponent
            className="button-component"
            textButton="Xem Thêm"
            onClick={handleOnClick}
            disabled={
              products?.total === products?.data?.length ||
              products?.totalPage === 1
            }
            dash="true"
          ></ButtonComponent>
        </div>
      </div>
    </Loading>
  );
}

export default HomePage;

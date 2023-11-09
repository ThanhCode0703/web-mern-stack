import TypeProduct from "../../TypeProduct/TypeProduct";
import React, { useEffect } from "react";
import "./HomePage.css";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.png";
import slider2 from "../../assets/images/slider2.png";
import slider3 from "../../assets/images/slider3.png";
import slider4 from "../../assets/images/slider4.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../service/ProductService";
import { useSelector } from "react-redux";
import { useState } from "react";
import Loading from "../../loading/loading";
import useDebounce from "../../hook/useDebounce";

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

  return (
    <Loading isLoading={isLoading || loading}>
      <div className="container-homepage">
        <div className="wrapper-type-product-homepage">
          {typeProducts.map((item, index) => {
            return <TypeProduct name={item} key={index} />;
          })}
        </div>
        <div className="wrapper-container-homepage">
          <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />
        </div>
        <div className="wrapper-card-component">
          {products?.data?.map((product) => {
            return (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                discount={product.discount}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
                id={product._id}
              />
            );
          })}
        </div>
        <div className="wrapper-button-component">
          <ButtonComponent
            className="button-component"
            textButton="Xem Thêm"
            onClick={() => setLimit((prev) => prev + 6)}
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

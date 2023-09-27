import TypeProduct from "../../TypeProduct/TypeProduct";
import React from "react";
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

function HomePage() {
  const arr = ["TV", "Tủ Lạnh", "Laptop"];
  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();
    console.log("res", res);
    return res;
  };
  const { isLoading, data: products } = useQuery(
    ["products"],
    fetchProductAll,
    { retry: 3, retryDelay: 1000 }
  );

  return (
    <div className="container-homepage">
      <div className="wrapper-type-product-homepage">
        {arr.map((item, index) => {
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
          type="outline"
          styledTextButton={{ fontWeight: 500 }}
        ></ButtonComponent>
      </div>
    </div>
  );
}

export default HomePage;

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
function HomePage() {
  const arr = ["TV", "Tủ Lạnh", "Laptop"];
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
        <CardComponent />
        <CardComponent />
        <CardComponent />
        <CardComponent />
        <CardComponent />
        <CardComponent />
        <CardComponent />
      </div>
      <div>
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

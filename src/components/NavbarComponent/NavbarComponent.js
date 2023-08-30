import React from "react";
import "./NavbarComponent.css";
import { Checkbox, Rate } from "antd";

function NavbarComponent() {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => (
          <div key={index}>
            <h1 className="choose">{option}</h1>
          </div>
        ));
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              // padding: "0 120px",
              flexDirection: "column",
            }}
            onChange={onChange}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.lable}</Checkbox>;
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option, index) => {
          return (
            <div className="feedback-star" key={index}>
              <Rate disabled defaultValue={option} />
              <span>{`từ ${option} sao`}</span>
            </div>
          );
        });
      case "price":
        return options.map((option, index) => {
          return (
            <div className="feedback-price" key={index}>
              {option}
            </div>
          );
        });
      default:
        return {};
    }
  };

  return (
    <div>
      <h4 className="lable-text">Lable</h4>
      {renderContent("text", ["Tu lanh", "TV", "May Giat"])}
      {renderContent("checkbox", [
        { value: "a", lable: "A" },
        { value: "b", lable: "B" },
        { value: "c", lable: "C" },
      ])}
      <div>{renderContent("star", [3, 4, 5])}</div>
      <div>{renderContent("price", ["dưới 4 triệu", "trên 5 triệu"])}</div>
    </div>
  );
}

export default NavbarComponent;

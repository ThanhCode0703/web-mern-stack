import React from "react";
import "./NavbarComponent.css";
import { Checkbox, Rate } from "antd";

function NavbarComponent() {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option1, index) => (
          <div key={index}>
            <h1 className="choose">{option1}</h1>
          </div>
        ));
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              flexDirection: "column",
            }}
            onChange={onChange}
          >
            {options.map((option2, index) => (
              <div key={index}>
                <Checkbox value={option2.value}>{option2.label}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option, index) => (
          <div className="feedback-star" key={index}>
            <Rate disabled defaultValue={option} />
            <span>{`từ ${option} sao`}</span>
          </div>
        ));
      case "price":
        return options.map((option, index) => (
          <div className="feedback-price" key={index}>
            {option}
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="container-navbar">
      <h4 className="label-text">Label</h4>
      {renderContent("text", ["Tu lanh", "TV", "May Giat"])}
      {renderContent("checkbox", [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
        { value: "c", label: "C" },
      ])}
      <div>{renderContent("star", [3, 4, 5])}</div>
      <div>{renderContent("price", ["dưới 4 triệu", "trên 5 triệu"])}</div>
    </div>
  );
}

export default NavbarComponent;

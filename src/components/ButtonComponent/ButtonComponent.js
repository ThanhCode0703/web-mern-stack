import { Button } from "antd";

function ButtonComponent({ size, icon, textButton, disabled, ...rest }) {
  return (
    <Button
      // style={{ colortextButton: "#fff" }}
      size={size}
      disabled={disabled}
      icon={icon}
      {...rest}
    >
      {textButton}
    </Button>
  );
}

export default ButtonComponent;

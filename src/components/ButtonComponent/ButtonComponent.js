import { Button } from "antd";

function ButtonComponent({ size, icon, textButton, ...rest }) {
  return (
    <Button size={size} icon={icon} {...rest}>
      {textButton}
    </Button>
  );
}

export default ButtonComponent;

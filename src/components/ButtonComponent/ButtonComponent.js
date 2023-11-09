import { Button } from "antd";

function ButtonComponent({ size, icon, textButton, disabled, ...rest }) {
  return (
    <Button size={size} disabled={disabled} icon={icon} {...rest}>
      {textButton}
    </Button>
  );
}

export default ButtonComponent;

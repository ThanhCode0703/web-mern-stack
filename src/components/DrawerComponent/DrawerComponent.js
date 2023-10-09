import { Drawer } from "antd";
function DrawerComponent({
  children,
  title = "drawer",
  placement = "right",
  isOpen = false,
  ...rests
}) {
  return (
    <div className="drawer-propeties-admin-management">
      <Drawer title={title} placement={placement} open={isOpen} {...rests}>
        {children}
      </Drawer>
    </div>
  );
}

export default DrawerComponent;

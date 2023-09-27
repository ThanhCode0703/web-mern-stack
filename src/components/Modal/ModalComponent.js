import { Modal } from "antd";

function ModalComponent({
  title = "ModalComponent",
  isOpen = false,
  children,
  ...rests
}) {
  return (
    <div className="modal-component-container">
      <Modal title={title} open={isOpen} {...rests}>
        {children}
      </Modal>
    </div>
  );
}

export default ModalComponent;

import TableComponent from "../Table/TableComponent";

function AdminUser() {
  return (
    <div className="user-admin-management-container">
      <h1> Quản lý người dùng </h1>
      <button type="button" className="btn btn-outline-success">
        <i className="fa-solid fa-user-plus"></i> Thêm
      </button>
      <div className="table-content-management-user">
        <TableComponent />
      </div>
    </div>
  );
}

export default AdminUser;

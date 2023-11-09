import { Space, Table } from "antd";
import { useRef, useState } from "react";
import React from "react";

import "./TableComponent.css";

import ButtonComponent from "../ButtonComponent/ButtonComponent";
import Loading from "../../loading/loading";
import { DownloadTableExcel } from "react-export-table-to-excel";

function TableComponent(props) {
  const tableRef = useRef(null);
  const {
    selectionType = "checkbox",
    data,
    columns,
    handleDeleteMany,
    isLoading = false,
  } = props;
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  //xóa all
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="table-component-container">
        {!!rowSelectedKeys.length > 0 && (
          <div>
            <Space>
              <ButtonComponent
                onClick={handleDeleteAll}
                style={{ marginBottom: 10, marginLeft: 20 }}
                textButton="Xóa tất cả"
              />
            </Space>
          </div>
        )}
        <DownloadTableExcel
          filename="user-table"
          sheet="users"
          currentTableRef={tableRef.current}
        >
          <button type="button" className="btn btn-success">
            Tải về file excel
          </button>
        </DownloadTableExcel>
        <Table
          ref={tableRef}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </div>
    </Loading>
  );
}

export default TableComponent;

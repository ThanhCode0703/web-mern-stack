import { Space, Table } from "antd";
import { useState } from "react";
import React from "react";

import "./TableComponent.css";

import ButtonComponent from "../ButtonComponent/ButtonComponent";
import Loading from "../../loading/loading";

function TableComponent(props) {
  const {
    selectionType = "checkbox",
    data,
    columns,
    handleDeleteMutipleProducts,
    isLoading = false,
  } = props;
  const [rowSelected, setRowSelected] = useState([]);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  //xóa all
  const handleDeleteAll = () => {
    handleDeleteMutipleProducts(rowSelected);
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="table-component-container">
        {rowSelected.length > 0 && (
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
        {/* <PieChartComponent /> */}
        <Table
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
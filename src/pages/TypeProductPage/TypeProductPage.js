import { Col, Pagination, Row } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import React, { useEffect } from "react";
import * as ProductService from "../../service/ProductService";
import { useSelector } from "react-redux";
import { useState } from "react";
import "./TypeProductPage.css";
import useDebounce from "../../hook/useDebounce";
import { useLocation } from "react-router-dom";
import Loading from "../../loading/loading";
function TypeProductPage() {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });
  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(type, page, limit);
    if (res?.status == "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPaginate({ ...paginate, total: res?.total });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, paginate.page, paginate.limit);
    }
  }, [state]);

  const onChange = (current, pageSize) => {
    setPaginate({ ...paginate, page: current - 1, limit: pageSize });
  };
  return (
    <Loading isLoading={loading}>
      <div className="container-type-product-page">
        <div className="wrapper-type-product-page">
          <Row>
            <Col span={24}>
              <div className="wrapper-type-card-component">
                {products
                  ?.filter((pro) => {
                    if (searchDebounce === "") {
                      return pro;
                    } else if (
                      pro?.name
                        ?.toLowerCase()
                        ?.includes(searchDebounce?.toLowerCase())
                    ) {
                      return pro;
                    }
                  })
                  ?.map((product) => {
                    return (
                      <CardComponent
                        key={product._id}
                        countInStock={product.countInStock}
                        description={product.description}
                        discount={product.discount}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        rating={product.rating}
                        type={product.type}
                        selled={product.selled}
                        id={product._id}
                      />
                    );
                  })}
              </div>
            </Col>
          </Row>
          <div className="type-product-pagination">
            <Pagination
              className="pagination-type-product"
              defaultCurrent={paginate.page + 1}
              total={paginate?.total}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default TypeProductPage;

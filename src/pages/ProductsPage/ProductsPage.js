import { useSelector } from "react-redux";
import TypeProduct from "../../TypeProduct/TypeProduct";
import Loading from "../../loading/loading";
import useDebounce from "../../hook/useDebounce";
import { useEffect, useState } from "react";
import * as ProductService from "../../service/ProductService";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import slider3 from "../../assets/images/slider3.png";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
// import "./ProductPage.css";

function ProductsPage() {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [loading, setLoading] = useState(false);
  const [typeProducts, setTypeProducts] = useState([]);
  const fetchProductAll = async (context) => {
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", searchDebounce], fetchProductAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  return (
    <Loading isLoading={isLoading || loading}>
      <div className="container-homepage">
        <div
          className="background-image"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <SliderComponent arrImages={[slider3]} />
        </div>
        <div className="wrapper-type-product-homepage">
          {typeProducts.map((item, index) => {
            return <TypeProduct name={item} key={index} />;
          })}
        </div>
        <div className="wrapper-container-homepage">
          <div className="wrapper-card-component">
            {products?.data?.map((product) => {
              return (
                <div key={product._id}>
                  <CardComponent
                    countInStock={product.countInStock}
                    description={product.description}
                    discount={product.discount}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    sold={product.sold}
                    id={product._id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default ProductsPage;

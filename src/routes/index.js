import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import NotFoundPage from "../pages/notFoundPage/NotFoundPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/product",
    page: ProductsPage,
    isShowHeader: true,
  },
  {
    path: "/type",
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];

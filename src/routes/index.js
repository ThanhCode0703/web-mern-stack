import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import NotFoundPage from "../pages/notFoundPage/NotFoundPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/HomePage/SignInPage/SignInPage";
import SignUpPage from "../pages/HomePage/SignIUpPage/SignUpPage";
import ProductDetailsPage from "../pages/HomePage/ProductDetailsPage/ProductDetailsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },

  {
    path: `*`,
    page: NotFoundPage,
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
    path: "product/:type",
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/product-details",
    page: ProductDetailsPage,
    isShowHeader: true,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: true,
    isPrivate: true,
  },

  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHeader: true,
    isPrivate: true,
  },
];

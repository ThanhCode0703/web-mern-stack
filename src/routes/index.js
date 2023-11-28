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
import PaymentPay from "../pages/PaymentPay/PaymentPay";
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";

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
    path: "/my-orders",
    page: MyOrderPage,
    isShowHeader: true,
  },

  {
    path: "/payment",
    page: PaymentPay,
    isShowHeader: true,
  },
  {
    path: "/orderSuccess",
    page: OrderSuccessPage,
    isShowHeader: true,
  },
  {
    path: "/details-order/:id",
    page: DetailsOrderPage,
    isShowHeader: true,
  },
  {
    path: "/product",
    page: ProductsPage,
    isShowHeader: true,
  },
  {
    path: "/product/:type",
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
    path: "/product-detail/:id",
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

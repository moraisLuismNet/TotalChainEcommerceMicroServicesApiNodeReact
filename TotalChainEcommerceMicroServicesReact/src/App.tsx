import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ListCategories = lazy(() => import("./pages/shop/ListCategories"));
const ListSubCategories = lazy(() => import("./pages/shop/ListSubCategories"));
const ListReferences = lazy(() => import("./pages/shop/ListReferences"));
const ListProducts = lazy(() => import("./pages/shop/ListProducts"));
const CartDetails = lazy(() => import("./pages/shop/CartDetails"));
const Payment = lazy(() => import("./pages/shop/Payment"));
const PaymentSuccess = lazy(() => import("./pages/shop/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/shop/PaymentCancel"));
const Orders = lazy(() => import("./pages/shop/Orders"));

const Categories = lazy(() => import("./pages/admin/Categories"));
const SubCategories = lazy(() => import("./pages/admin/SubCategories"));
const References = lazy(() => import("./pages/admin/References"));
const Products = lazy(() => import("./pages/admin/Products"));
const Carts = lazy(() => import("./pages/admin/Carts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const Users = lazy(() => import("./pages/admin/Users"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const Kardex = lazy(() => import("./pages/admin/Kardex"));
const Messages = lazy(() => import("./pages/admin/Messages"));
const Mails = lazy(() => import("./pages/admin/Mails"));
const Shipments = lazy(() => import("./pages/admin/Shipments"));
const MyShipments = lazy(() => import("./pages/shop/MyShipments"));
const HomeRedirect = lazy(() => import("./components/common/HomeRedirect"));

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>}>
    {children}
  </Suspense>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute><S>{children}</S></ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "login", element: <S><Login /></S> },
      { path: "register", element: <S><Register /></S> },
      { index: true, element: <S><HomeRedirect /></S> },
      { path: "list-categories", element: <S><ListCategories /></S> },
      { path: "list-subcategories/:categoryId", element: <S><ListSubCategories /></S> },
      { path: "list-subcategories", element: <S><ListSubCategories /></S> },
      { path: "list-references/:subCategoryId", element: <S><ListReferences /></S> },
      { path: "list-references", element: <S><ListReferences /></S> },
      { path: "list-products/:subCategoryId", element: <S><ListProducts /></S> },
      { path: "all-products", element: <S><ListProducts /></S> },
      { path: "cart-details", element: <P><CartDetails /></P> },
      { path: "payment", element: <P><Payment /></P> },
      { path: "payment/success", element: <S><PaymentSuccess /></S> },
      { path: "payment/cancel", element: <S><PaymentCancel /></S> },
      { path: "orders", element: <P><Orders /></P> },
      { path: "my-shipments", element: <P><MyShipments /></P> },
      { path: "categories", element: <P><Categories /></P> },
      { path: "subcategories", element: <P><SubCategories /></P> },
      { path: "references", element: <P><References /></P> },
      { path: "products", element: <P><Products /></P> },
      { path: "carts", element: <P><Carts /></P> },
      { path: "admin-orders", element: <P><AdminOrders /></P> },
      { path: "users", element: <P><Users /></P> },
      { path: "audit-logs", element: <P><AuditLogs /></P> },
      { path: "kardex", element: <P><Kardex /></P> },
      { path: "messages", element: <P><Messages /></P> },
      { path: "mails", element: <P><Mails /></P> },
      { path: "shipments", element: <P><Shipments /></P> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

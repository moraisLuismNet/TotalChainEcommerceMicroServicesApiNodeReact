import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ListProducts from "../../pages/shop/ListProducts";

const HomeRedirect = () => {
  const { isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/products" replace />;
  return <ListProducts />;
};

export default HomeRedirect;

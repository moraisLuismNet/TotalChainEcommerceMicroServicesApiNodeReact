import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const restoreFromCookie = useAuthStore((state) => state.restoreFromCookie);

  // Try to restore from cookie on first render
  useEffect(() => {
    if (!isAuthenticated) {
      restoreFromCookie();
    }
  }, []);

  // Check auth from localStorage as fallback (in case Zustand hasn't hydrated yet)
  const isLoggedInFromStorage = (() => {
    const token = localStorage.getItem("token");
    const authStorage = localStorage.getItem("auth-storage");
    if (token) return true;
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        return !!parsed.state?.token;
      } catch {}
    }
    return false;
  })();

  if (isAuthenticated) return <>{children}</>;
  if (isLoggedInFromStorage && restoreFromCookie()) return <>{children}</>;

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
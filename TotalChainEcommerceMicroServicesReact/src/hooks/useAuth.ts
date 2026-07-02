import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";
import { useCartStore } from "../store/cartStore";
import type { ILogin, IUserSession } from "../interfaces/login.interface";
import type { IRegister } from "../interfaces/register.interface";

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    token,
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
  } = useAuthStore();
  const { loadCartFromBackend } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: ILogin) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.login(credentials);
        if (response.success) {
          const userSession: IUserSession = {
            email: response.data.email,
            token: response.data.token,
            role: response.data.role,
          };
      storeLogin(userSession, response.data.token);
      authService.saveAuthData(response.data.token, { email: response.data.email, role: response.data.role });
      document.cookie = `token=${encodeURIComponent(response.data.token)}; SameSite=Lax; Path=/; Max-Age=86400`;

          if (userSession.role?.toUpperCase() !== "ADMIN") {
            try {
              await loadCartFromBackend();
            } catch {
              console.error("Failed to load cart after login");
            }
          }

          navigate("/");
          return { success: true };
        }
        const msg = response.message || "Login failed";
        setError(msg);
        return { success: false, message: msg };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An error occurred during login";
        setError(msg);
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, loadCartFromBackend, navigate]
  );

  const register = useCallback(async (userData: IRegister) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred during registration";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storeLogout();
    authService.logout();
    document.cookie = 'token=; Max-Age=0; Path=/';
    navigate("/login");
  }, [storeLogout, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: user?.role?.toUpperCase() === "ADMIN",
  };
};

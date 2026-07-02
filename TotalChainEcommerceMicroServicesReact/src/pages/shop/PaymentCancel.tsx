/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState("");
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    const restoreCart = async () => {
      const orderId = searchParams.get("order_id");
      // Prevent double-execution (React Strict Mode runs effects twice in dev)
      if (orderId && !hasRestoredRef.current) {
        hasRestoredRef.current = true;
        setRestoring(true);
        try {
          // Restore auth from cookie first
          const restoreFromCookie = useAuthStore.getState().restoreFromCookie;
          const isAuthenticated = useAuthStore.getState().isAuthenticated;
          
          if (!isAuthenticated) {
            const restored = restoreFromCookie();
            if (!restored) {
              // Fallback: try to restore from localStorage directly
              const tokenFromStorage = localStorage.getItem("token");
              const userFromStorage = localStorage.getItem("user");
              const authStorageStr = localStorage.getItem("auth-storage");
              
              if (tokenFromStorage) {
                try {
                  const user = userFromStorage ? JSON.parse(userFromStorage) : null;
                  const authStorage = authStorageStr ? JSON.parse(authStorageStr) : null;
                  
                  const userData = authStorage?.state?.user || user;
                  const tokenData = authStorage?.state?.token || tokenFromStorage;
                  
                  if (userData && tokenData) {
                    useAuthStore.setState({
                      user: userData,
                      token: tokenData,
                      isAuthenticated: true,
                    });
                  }
                } catch {
                  // ignore
                }
              }
            }
          }
          
          const token = localStorage.getItem("token") || useAuthStore.getState().token;

          if (!token) {
            throw new Error("User session expired. Please log in again.");
          }

          // Call API to cancel order (email comes from auth middleware via token)
          const response = await fetch(
            `/api/orders/cancel/${encodeURIComponent(orderId)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to restore cart");
          }

          // Load cart from backend after successful restoration
          const email = useAuthStore.getState().user?.email;

          if (email && token) {
            // Sync cart from backend
            const cartResponse = await fetch(`/api/cartdetails/${encodeURIComponent(email)}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (cartResponse.ok) {
              const cartData = await cartResponse.json();
              const backendItems = cartData.data || [];
              
              // Update cart store
              useCartStore.setState({
                items: backendItems.map((item: any) => ({
                  id: item.productId || item.ProductId,
                  code: item.productCode || item.ProductCode || "",
                  name: item.productName || item.ProductName || "",
                  description: "",
                  imageProduct: item.imageProduct || item.ImageProduct || "",
                  referenceId: "",
                  unitPrice: Number(item.unitPrice || item.UnitPrice || 0),
                  costPrice: 0,
                  minStock: 0,
                  stock: Number(item.stock || item.Stock || 0),
                  isActive: true,
                  quantity: Number(item.amount || item.Amount || 0),
                })),
                total: backendItems.reduce((sum: number, i: any) => sum + (i.unitPrice || i.UnitPrice || 0) * (i.amount || i.Amount || 0), 0),
                stockChanges: {},
                isHydrated: true,
              });
            }
          }

          setRestoreMessage(
            "✅ Your cart has been restored with all items from cancelled order."
          );
        } catch (error: any) {
          setRestoreMessage(
            `⚠️ ${error.message}. Your cart may still contain items from before the order.`
          );
        } finally {
          setRestoring(false);
        }
      } else if (!orderId) {
        // No order_id means order was not created yet, cart should still be in backend
        setRestoreMessage("⚠️ Payment cancelled. Your cart is still available.");
      }
    };

    restoreCart();
  }, [searchParams]);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="alert alert-warning">
          <h1>❌ Payment Cancelled</h1>
          <p className="lead">You have cancelled the payment process</p>
          <p>Your card has not been charged.</p>
        </div>

        {restoring && (
          <div className="alert alert-info">
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></div>
            Restoring your cart items...
          </div>
        )}

        {restoreMessage && (
          <div
            className={`alert ${
              restoreMessage.includes("✅") ? "alert-success" : "alert-warning"
            }`}
          >
            {restoreMessage}
          </div>
        )}

        <div className="mt-4">
          <Link
            to="/cart-details"
            className="btn btn-primary me-3"
          >
            Back to cart
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
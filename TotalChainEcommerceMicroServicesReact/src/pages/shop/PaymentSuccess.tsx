import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { confirmPayment } from "../../services/stripe.service";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((state) => state.clearCart);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!sessionId || confirmedRef.current) return;
    confirmedRef.current = true;
    confirmPayment(sessionId)
      .then((id) => {
        setOrderId(id);
        clearCart();
        setConfirmed(true);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Payment confirmation failed:", err);
      });
  }, [sessionId, clearCart]);

  return (
    <div className="container mt-5 text-center">
      <div className="mb-4">
        <i className="pi pi-check-circle text-success" style={{ fontSize: "4rem" }}></i>
      </div>
      <h2>Payment Successful!</h2>
      {orderId && <p className="text-muted">Order ID: {orderId}</p>}
      {confirmed && <p className="text-muted">Your order has been confirmed.</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mt-4">
        <Link to="/orders" className="btn btn-primary me-2">View My Orders</Link>
        <Link to="/" className="btn btn-outline-primary">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

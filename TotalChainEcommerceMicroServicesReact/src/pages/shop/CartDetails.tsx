import { useEffect, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { cartDetailService } from "../../services/cart-detail.service";
import { cartsService } from "../../services/carts.service";
import { ordersService } from "../../services/orders.service";
import Footer from "../../components/layout/Footer";

const CartDetails = () => {
  const { items, total, addItem, updateQuantity, clearCart, loadCartFromBackend } = useCart();
  const getStockChange = useCartStore((state) => state.getStockChange);
  const { user, token } = useAuth();

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23111827' width='80' height='80'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='10' text-anchor='middle' x='40' y='45'%3ENo img%3C/text%3E%3C/svg%3E";
  const imgSrc = (url: string | undefined | null) =>
    url || PLACEHOLDER;
  const fmtPrice = (n: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "€";

  useEffect(() => {
    loadCartFromBackend();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProceedToPay = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token || !user?.email) throw new Error("User not authenticated");
      if (items.length === 0) throw new Error("The cart is empty.");

      // Don't create order here - backend will create it when Stripe confirms payment
      const { checkoutUrl } = await cartsService.checkout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || "Payment process failed";
      // If sync fails, clear local cart as items may be invalid
      console.error("Payment process failed:", err);
      clearCart();
      setError("Some products in your cart are no longer available. Please add them again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <div className="container mt-5">
          <div className="text-center">
            <h2>Your Cart is Empty</h2>
            <p>Start shopping to add items to your cart!</p>
            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
        <div className="mt-5"></div>
        <Footer />
      </>
    );
  }

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-4">Cart Details</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th style={{ width: "100px" }}></th>
                <th>Product</th>
                <th>Code</th>
                <th style={{ width: "80px", textAlign: "center" }}>Amount</th>
                <th style={{ width: "120px", textAlign: "right", whiteSpace: "nowrap" }}>Price</th>
                <th style={{ width: "130px", textAlign: "right", whiteSpace: "nowrap" }}>Total</th>
                <th style={{ width: "220px" }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const currentStock = item.stock + getStockChange(item.id);
                const lineTotal = item.unitPrice * item.quantity;
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ width: "80px", height: "80px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                        <img src={imgSrc(item.imageProduct)} alt={item.name} style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }} />
                      </div>
                    </td>
                    <td>{item.name || "No title available"}</td>
                    <td>{item.code || "N/A"}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{fmtPrice(item.unitPrice)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap", fontWeight: "bold" }}>{fmtPrice(lineTotal)}</td>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        <button className="btn btn-info btn-sm text-white"
                          onClick={() => addItem(item)}
                          disabled={currentStock < 1}
                          style={{ minWidth: "90px", height: "36px", borderRadius: "0.375rem" }}>
                          <i className="pi pi-shopping-cart me-1"></i> Add
                        </button>
                        <button className="btn btn-danger btn-sm text-white"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ minWidth: "90px", height: "36px", borderRadius: "0.375rem" }}>
                          <i className="pi pi-trash me-1"></i> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td><strong>Total</strong></td>
                <td style={{ textAlign: "center" }}>{totalQty}</td>
                <td></td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap", fontWeight: "bold" }}>{fmtPrice(total)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-4 mb-5">
          <button className="btn btn-success"
            onClick={handleProceedToPay}
            disabled={loading || items.length === 0}
            style={{ minWidth: "150px", fontWeight: 600, borderRadius: "0.375rem" }}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Processing...</>
            ) : (
              <><i className="pi pi-credit-card me-2"></i> Pay</>
            )}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartDetails;
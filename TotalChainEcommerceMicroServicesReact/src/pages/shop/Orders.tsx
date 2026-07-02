import { useEffect, useState, Fragment } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ordersService } from "../../services/orders.service";
import type { IOrder } from "../../interfaces/ecommerce.interfaces";
import Footer from "../../components/layout/Footer";

const fmtPrice = (n: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "€";

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) { setLoading(false); return; }
      try {
        const data = await ordersService.getByUserEmail(user.email);
        // Filter to show only completed orders (paid orders)
        const completedOrders = data.filter(order => order.status !== "pending" && order.status !== "cancelled");
        setOrders(completedOrders);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (isAuthenticated) fetchOrders();
  }, [user, isAuthenticated]);

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <div className="alert alert-info">No orders found</div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.idOrder}>
                  <tr key={`${order.idOrder}-main`} style={{ cursor: "pointer" }}
                    onClick={() => setExpandedOrder(expandedOrder === order.idOrder ? null : order.idOrder)}>
                    <td>#{order.idOrder}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.paymentMethod || "Pending"}</td>
                    <td className="fw-bold">{fmtPrice(order.total)}</td>
                    <td><i className={`pi pi-chevron-${expandedOrder === order.idOrder ? "up" : "down"}`}></i></td>
                  </tr>
                  {expandedOrder === order.idOrder && (
                    <tr key={`${order.idOrder}-detail`}>
                      <td colSpan={5}>
                        <table className="table table-sm mb-0">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Amount</th>
                              <th>Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.details?.map((detail) => (
                              <tr key={detail.idOrderDetail}>
                                <td>{detail.productName || `Product #${detail.productId}`}</td>
                                <td>{detail.amount}</td>
                                <td>{fmtPrice(detail.price)}</td>
                                <td>{fmtPrice(detail.total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
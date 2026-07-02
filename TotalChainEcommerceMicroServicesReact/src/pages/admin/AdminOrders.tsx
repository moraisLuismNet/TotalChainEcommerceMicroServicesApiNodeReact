import { useEffect, useState, Fragment } from "react";
import { ordersService } from "../../services/orders.service";
import type { IOrder } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const fmtPrice = (n: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "€";

const AdminOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ordersService.getAll();
        setOrders(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = orders.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.userEmail.toLowerCase().includes(term) ||
      o.idOrder.toString().includes(term) ||
      (o.paymentMethod && o.paymentMethod.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Orders Management</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by email, order ID, payment method..."
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>
      <table className="table table-hover">
        <thead>
          <tr><th>Order ID</th><th>User</th><th>Date</th><th>Payment</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {currentItems.map((order) => (
            <Fragment key={order.idOrder}>
              <tr style={{ cursor: "pointer" }}
                onClick={() => setExpandedOrder(expandedOrder === order.idOrder ? null : order.idOrder)}>
                <td>#{order.idOrder}</td>
                <td>{order.userEmail}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.paymentMethod || "Pending"}</td>
                <td className="fw-bold">{fmtPrice(order.total)}</td>
                <td><i className={`pi pi-chevron-${expandedOrder === order.idOrder ? "up" : "down"}`}></i></td>
              </tr>
              {expandedOrder === order.idOrder && (
                <tr key={`detail-${order.idOrder}`}>
                  <td colSpan={6}>
                    <table className="table table-sm mb-0">
                      <thead><tr><th>Product</th><th>Amount</th><th>Price</th><th>Total</th></tr></thead>
                      <tbody>
                        {order.details?.map((d) => (
                          <tr key={d.idOrderDetail}>
                            <td>{d.productName || `Product #${d.productId}`}</td>
                            <td>{d.amount}</td>
                            <td>{fmtPrice(d.price)}</td>
                            <td>{fmtPrice(d.total)}</td>
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default AdminOrders;

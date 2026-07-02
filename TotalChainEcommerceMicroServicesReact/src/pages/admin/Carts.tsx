import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cartsService } from "../../services/carts.service";
import type { ICart } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const fmtPrice = (n: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "€";

const Carts = () => {
  const { user, isAdmin } = useAuth();
  const [carts, setCarts] = useState<ICart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCartId, setExpandedCartId] = useState<number | null>(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) { navigate("/cart-details"); return; }
    const fetch = async () => {
      try {
        const data = await cartsService.getAll();
        setCarts(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [isAdmin, navigate]);

  const filtered = carts.filter((c) =>
    c.userEmail !== user?.email &&
    c.userEmail.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  const toggleExpand = (idCart: number) => {
    setExpandedCartId(expandedCartId === idCart ? null : idCart);
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Carts Management</h2>

      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by cart email"
          value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
      </div>

      {currentItems.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th><th>User Email</th><th>Total Price</th><th>Status</th><th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cart) => (
                <Fragment key={cart.idCart}>
                  <tr>
                    <td>{cart.idCart}</td>
                    <td>{cart.userEmail}</td>
                    <td className="fw-bold">{fmtPrice(cart.totalPrice)}</td>
                    <td>
                      {cart.enabled ? (
                        <span className="badge bg-success text-white text-decoration-none"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/cart-details?viewingUserEmail=${encodeURIComponent(cart.userEmail)}`)}>
                          ACTIVE
                        </span>
                      ) : (
                        <span className="badge bg-danger text-white">DISABLED</span>
                      )}
                    </td>
                    <td>
                      <button className={`btn btn-sm ${expandedCartId === cart.idCart ? "btn-secondary" : "btn-info"}`}
                        onClick={() => toggleExpand(cart.idCart)}>
                        <i className={`pi ${expandedCartId === cart.idCart ? "pi-chevron-up" : "pi-chevron-down"}`}></i>
                      </button>
                    </td>
                  </tr>
                  {expandedCartId === cart.idCart && (
                    <tr key={`${cart.idCart}-details`}>
                      <td colSpan={5} className="p-0">
                        <div className="p-3 bg-light border">
                          <h6>Items in this Cart:</h6>
                          <div className="table-responsive">
                            <table className="table table-sm table-bordered">
                              <thead className="table-secondary">
                                <tr><th>Product</th><th>Unit Price</th><th>Quantity</th><th>Total</th></tr>
                              </thead>
                              <tbody>
                                {cart.cartDetails && cart.cartDetails.length > 0 ? (
                                  cart.cartDetails.map((item) => (
                                    <tr key={item.idCartDetail}>
                                      <td>{item.productName}</td>
                                      <td>{fmtPrice(item.price)}</td>
                                      <td>{item.amount}</td>
                                      <td>{fmtPrice(item.total)}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr><td colSpan={4} className="text-center">This cart has no items</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading && carts.filter((c) => c.userEmail !== user?.email).length > 0 ? (
        <div className="alert alert-info">No carts match your search criteria</div>
      ) : !loading && carts.length === 0 ? (
        <div className="alert alert-warning">No carts available</div>
      ) : null}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Carts;

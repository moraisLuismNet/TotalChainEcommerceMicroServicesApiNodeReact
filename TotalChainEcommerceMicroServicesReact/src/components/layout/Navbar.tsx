import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

const Navbar = () => {
  const location = useLocation();
  const { loadCartFromBackend, isHydrated, cartCount, total } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const fmtPrice = (n: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "€";

  useEffect(() => {
    if (isAuthenticated && !isHydrated && !isAdmin) {
      loadCartFromBackend().catch((err) => {
        console.error("Failed to re-hydrate cart on refresh:", err);
      });
    }
  }, [isAuthenticated, isHydrated, loadCartFromBackend, isAdmin]);

  const isActive = (path: string) => location.pathname === path;
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <img src="/TotalChainEcommerce.png" alt="Logo" height="30" className="d-inline-block align-text-top me-2" />
          TotalChainEcommerce
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!isAdmin && !isActivePrefix("/list-categories") && (
              <li className="nav-item">
                <Link className="nav-link" to="/list-categories">CATEGORIES</Link>
              </li>
            )}
            {!isAdmin && !isActive("/list-products") && !isActive("/") && (
              <li className="nav-item">
                <Link className="nav-link" to="/list-products">PRODUCTS</Link>
              </li>
            )}
            {isAuthenticated && !isAdmin && !isActivePrefix("/orders") && (
              <li className="nav-item">
                <Link className="nav-link" to="/orders">MY ORDERS</Link>
              </li>
            )}
            {isAuthenticated && !isAdmin && !isActivePrefix("/my-shipments") && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-shipments">MY SHIPMENTS</Link>
              </li>
            )}
            {isAdmin && (
              <>
                {!isActivePrefix("/categories") && (
                  <li className="nav-item"><Link className="nav-link" to="/categories">CATEGORIES</Link></li>
                )}
                {!isActivePrefix("/subcategories") && (
                  <li className="nav-item"><Link className="nav-link" to="/subcategories">SUBCATEGORIES</Link></li>
                )}
                {!isActivePrefix("/references") && (
                  <li className="nav-item"><Link className="nav-link" to="/references">REFERENCES</Link></li>
                )}
                {!isActivePrefix("/products") && (
                  <li className="nav-item"><Link className="nav-link" to="/products">PRODUCTS</Link></li>
                )}
                {!isActivePrefix("/kardex") && (
                  <li className="nav-item"><Link className="nav-link" to="/kardex">KARDEX</Link></li>
                )}
                {!isActivePrefix("/carts") && (
                  <li className="nav-item"><Link className="nav-link" to="/carts">CARTS</Link></li>
                )}
                {!isActivePrefix("/admin-orders") && (
                  <li className="nav-item"><Link className="nav-link" to="/admin-orders">ORDERS</Link></li>
                )}
                {!isActivePrefix("/mails") && (
                  <li className="nav-item"><Link className="nav-link" to="/mails">MAILS</Link></li>
                )}
                {!isActivePrefix("/messages") && (
                  <li className="nav-item"><Link className="nav-link" to="/messages">MESSAGES</Link></li>
                )}
                {!isActivePrefix("/shipments") && (
                  <li className="nav-item"><Link className="nav-link" to="/shipments">SHIPMENTS</Link></li>
                )}
                {!isActivePrefix("/users") && (
                  <li className="nav-item"><Link className="nav-link" to="/users">USERS</Link></li>
                )}
                {!isActivePrefix("/audit-logs") && (
                  <li className="nav-item"><Link className="nav-link" to="/audit-logs">AUDIT</Link></li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item me-2">
                  <span className="nav-link text-muted">{user?.email}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {!isActive("/login") && (
                  <li className="nav-item me-2">
                    <Link className="btn btn-outline-primary btn-sm" to="/login">Login</Link>
                  </li>
                )}
                {!isActive("/register") && (
                  <li className="nav-item">
                    <Link className="btn btn-outline-primary btn-sm" to="/register">Register</Link>
                  </li>
                )}
              </>
            )}

            {isAuthenticated && !isAdmin && (
              <li className="nav-item ms-3">
                {location.pathname === "/cart-details" || cartCount === 0 ? (
                  <span className="nav-link d-flex align-items-center text-muted">
                    <div className="position-relative">
                      <i className="pi pi-shopping-cart fs-5"></i>
                      {cartCount > 0 && (
                        <span className="badge bg-primary position-absolute top-0 start-100 translate-middle"
                          style={{ fontSize: "0.6rem" }}>
                          {cartCount}
                        </span>
                      )}
                    </div>
                    {total > 0 && <span className="ms-2 small fw-bold">{fmtPrice(total)}</span>}
                  </span>
                ) : (
                  <Link className="nav-link d-flex align-items-center" to="/cart-details">
                    <div className="position-relative">
                      <i className="pi pi-shopping-cart fs-5"></i>
                      {cartCount > 0 && (
                        <span className="badge bg-primary position-absolute top-0 start-100 translate-middle"
                          style={{ fontSize: "0.6rem" }}>
                          {cartCount}
                        </span>
                      )}
                    </div>
                    {total > 0 && <span className="ms-2 small fw-bold">{fmtPrice(total)}</span>}
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

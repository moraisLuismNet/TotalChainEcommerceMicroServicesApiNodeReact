import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { productsService } from "../../services/products.service";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import type { IProduct } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";
import Footer from "../../components/layout/Footer";

const ListProducts = () => {
  const { subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const { isAuthenticated, isAdmin } = useAuth();
  const { items, addItem, removeItem, removeOne } = useCart();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='180'%3E%3Crect fill='%23111827' width='400' height='180'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='16' text-anchor='middle' x='200' y='95'%3EImage unavailable%3C/text%3E%3Csvg%3E";
  const fmtPrice = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
  const imgSrc = (url: string | undefined | null) =>
    url || PLACEHOLDER;
  const itemsPerPage = 6;

  const fetchProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      let data: IProduct[];
      if (referenceId) {
        data = await productsService.getByReference(referenceId);
      } else if (subCategoryId) {
        const all = await productsService.getAll();
        const refs = await import("../../services/references.service").then(m => m.referencesService.getAll());
        const refIds = refs.filter(r => r.subCategoryId === subCategoryId).map(r => r.id);
        data = all.filter(p => refIds.includes(p.referenceId));
      } else {
        data = await productsService.getAll();
      }
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { if (!isSilent) setLoading(false); }
  }, [referenceId, subCategoryId]);

  useEffect(() => {
    fetchProducts(false);
    const interval = setInterval(() => {
      fetchProducts(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const handleAdd = async (product: IProduct) => {
    await addItem(product);
    fetchProducts(true);
  };

  const handleRemove = async (productId: string) => {
    await removeOne(productId);
    fetchProducts(true);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.code.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);
  const isInCart = (productId: string) => items.some((i) => i.id === productId);
  const getQty = (productId: string) => items.find((i) => i.id === productId)?.quantity || 0;
  const availableStock = (backendStock: number) => Math.max(0, Number(backendStock));

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <>
      <div className="pb-4" style={{ backgroundColor: "#111827", paddingTop: "2rem" }}>
        <div className="container text-center">
          <h1 className="display-5 fw-bold text-white mb-4">Discover Exclusive Products</h1>
          <p className="lead text-white mx-auto" style={{ maxWidth: "600px" }}>
            Explore our unique collection of products. Find the perfect addition to your collection today.
          </p>
        </div>
      </div>
      <div className="container pt-5 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Available Products</h2>
          <div className="col-md-4 px-0">
            <input type="text" className="form-control" placeholder="Search by name or code..."
              value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>

        {!isAuthenticated && (
          <div className="alert alert-warning p-2 mb-4">
            <small><i className="pi pi-exclamation-triangle me-2"></i>Sign in to interact with the cart</small>
          </div>
        )}

        {currentItems.length === 0 ? (
          <div className="alert alert-info">No products found</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentItems.map((product) => (
              <div key={product.id} className="col">
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  {product.imageProduct && (
                    <div className="position-relative" style={{ height: "180px", cursor: "pointer" }}
                      onClick={() => setSelectedImage(product.imageProduct!)}>
                      <img src={imgSrc(product.imageProduct)} alt={product.name}
                        className="card-img-top h-100 w-100 object-fit-cover" />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold">{product.name}</h5>
                    <p className="text-muted small mb-1">Code: {product.code}</p>
                    {product.referenceName && (
                      <p className="text-muted small mb-1">{product.referenceName}</p>
                    )}
                    <p className="text-muted small mb-2">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold fs-5">{fmtPrice(product.unitPrice)}</span>
                      <span className={`badge ${availableStock(product.stock) > 0 ? "bg-success" : "bg-danger"}`}>
                        {availableStock(product.stock) > 0 ? `${availableStock(product.stock)} in stock` : "Out of stock"}
                      </span>
                    </div>
                    {availableStock(product.stock) > 0 && Number(product.minStock) > 0 && availableStock(product.stock) <= Number(product.minStock) && (
                      <span className="badge bg-warning text-dark mb-2">Low stock</span>
                    )}
                    <div className="mt-auto d-flex flex-column gap-2">
                      {!isAdmin && availableStock(product.stock) > 0 && (
                        <button className="btn btn-outline-primary w-100"
                          disabled={!isAuthenticated}
                          onClick={() => handleAdd(product)}>
                          <i className="pi pi-cart-plus me-1"></i> Add
                        </button>
                      )}
                      {!isAdmin && isAuthenticated && getQty(product.id) > 0 && (
                          <button className="btn btn-outline-danger w-100"
                            onClick={() => handleRemove(product.id)}>
                            <i className="pi pi-trash me-1"></i> Remove ({getQty(product.id)})
                          </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        {selectedImage && (
          <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectedImage(null)}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-body text-center">
                  <img src={imgSrc(selectedImage)} alt="Preview" className="img-fluid" />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedImage(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ListProducts;

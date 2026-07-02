import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { referencesService } from "../../services/references.service";
import type { IProduct, IReference } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const emptyProduct: Partial<IProduct> = {
  code: "", name: "", description: "", imageProduct: null,
  referenceId: "", unitPrice: 0, costPrice: 0, minStock: 0, stock: 0, isActive: true,
};

const fmtPrice = (n: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "€";

const Products = () => {
  const { filteredProducts, loading, error, searchTerm, setSearchTerm, addProduct, updateProduct, deleteProduct } = useProducts();
  const [references, setReferences] = useState<IReference[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<IProduct>>({ ...emptyProduct });
  const [showImage, setShowImage] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewProduct, setPreviewProduct] = useState<{ name: string; reference: string; unitPrice: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<IProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    referencesService.getAll().then(setReferences).catch(console.error);
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfLast - itemsPerPage, indexOfLast);

  const openNew = () => { setEditItem({ ...emptyProduct }); setShowDialog(true); };
  const openEdit = (p: IProduct) => { setEditItem({ ...p }); setShowDialog(true); };

  const save = async () => {
    try {
      if (editItem.id) {
        await updateProduct(editItem as IProduct);
      } else {
        await addProduct(editItem);
      }
      setShowDialog(false);
    } catch { /* handled */ }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteProduct(itemToDelete.id);
      setItemToDelete(null);
    } catch { /* handled */ } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={openNew}>New Product</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by name, code or reference..."
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Image</th><th>Code</th><th>Name</th><th>Reference</th>
              <th>Unit Price</th><th>Stock</th><th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.imageProduct ? (
                    <img src={p.imageProduct} alt={p.name} style={{ width: "40px", height: "40px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => { setPreviewImage(p.imageProduct!); setPreviewProduct({ name: p.name, reference: p.referenceName || p.referenceId, unitPrice: p.unitPrice }); setShowImage(true); }} />
                  ) : <span className="text-muted">No img</span>}
                </td>
                <td>{p.code}</td>
                <td>{p.name}</td>
                <td>{p.referenceName || p.referenceId}</td>
                <td>{fmtPrice(p.unitPrice)}</td>
                <td>
                  <span className={`badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}>{p.stock}</span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(p)}><i className="pi pi-pencil"></i></button>
                  <button className="btn btn-sm btn-outline-danger"
                    disabled={p.stock !== 0}
                    title={p.stock !== 0 ? "Cannot delete product with stock" : "Delete Product"}
                    onClick={() => setItemToDelete(p)}><i className="pi pi-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {showDialog && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editItem.id ? "Edit Product" : "New Product"}</h5>
                <button className="btn-close" onClick={() => setShowDialog(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Reference</label>
                      <select className="form-select" value={editItem.referenceId || ""}
                        onChange={(e) => setEditItem({ ...editItem, referenceId: e.target.value })}>
                        <option value="">Select reference</option>
                        {references.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Code</label>
                      <input type="text" className="form-control" value={editItem.code || ""}
                        onChange={(e) => setEditItem({ ...editItem, code: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" value={editItem.name || ""}
                        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" value={editItem.description || ""}
                        onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input type="text" className="form-control" value={editItem.imageProduct || ""}
                        onChange={(e) => setEditItem({ ...editItem, imageProduct: e.target.value || null })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Unit Price</label>
                      <input type="number" className="form-control" step="0.01" value={editItem.unitPrice || 0}
                        onChange={(e) => setEditItem({ ...editItem, unitPrice: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Cost Price</label>
                      <input type="number" className="form-control" step="0.01" value={editItem.costPrice || 0}
                        onChange={(e) => setEditItem({ ...editItem, costPrice: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Min Stock</label>
                      <input type="number" className="form-control" value={editItem.minStock || 0}
                        onChange={(e) => setEditItem({ ...editItem, minStock: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Initial Stock</label>
                      <input type="number" className="form-control" value={editItem.stock || 0}
                        onChange={(e) => setEditItem({ ...editItem, stock: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="isActive"
                        checked={editItem.isActive ?? true}
                        onChange={(e) => setEditItem({ ...editItem, isActive: e.target.checked })} />
                      <label className="form-check-label" htmlFor="isActive">Active</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDialog(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImage && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowImage(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{previewProduct?.name}</h5>
                <button className="btn-close" onClick={() => setShowImage(false)}></button>
              </div>
              <div className="modal-body text-center">
                {previewProduct?.reference && <p className="text-muted mb-1">{previewProduct.reference}</p>}
                {previewProduct && <p className="fw-bold mb-3">{fmtPrice(previewProduct.unitPrice)}</p>}
                <img src={previewImage} alt={previewProduct?.name || "Preview"} className="img-fluid" />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowImage(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setItemToDelete(null)} disabled={deleting} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the product <strong>"{itemToDelete.name}"</strong>? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setItemToDelete(null)} disabled={deleting}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>
                  {deleting ? <><span className="spinner-border spinner-border-sm me-2" />Deleting...</> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

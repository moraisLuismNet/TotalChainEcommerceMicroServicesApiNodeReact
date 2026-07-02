import { useState, useEffect } from "react";
import { useReferences } from "../../hooks/useReferences";
import { subcategoriesService } from "../../services/subcategories.service";
import type { IReference, ISubCategory } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const emptyRef: Partial<IReference> = { name: "", description: "", subCategoryId: "", isActive: true };

const References = () => {
  const { references, loading, error, createReference, updateReference, deleteReference } = useReferences();
  const [subcategories, setSubcategories] = useState<ISubCategory[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<IReference>>({ ...emptyRef });
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<IReference | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    subcategoriesService.getAll().then(setSubcategories).catch(console.error);
  }, []);

  const filtered = references.filter((r) =>
    r.name?.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  const openNew = () => { setEditItem({ ...emptyRef }); setShowDialog(true); };
  const openEdit = (r: IReference) => { setEditItem({ ...r }); setShowDialog(true); };

  const save = async () => {
    try {
      if (editItem.id) {
        await updateReference(editItem as IReference);
      } else {
        await createReference(editItem);
      }
      setShowDialog(false);
    } catch { /* handled */ }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteReference(itemToDelete.id);
      setItemToDelete(null);
    } catch { /* handled */ } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>References</h2>
        <button className="btn btn-primary" onClick={openNew}>New Reference</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by name..."
          value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
      </div>
      <table className="table table-hover">
        <thead><tr><th>Name</th><th>Description</th><th>Subcategory</th><th>Products</th><th></th></tr></thead>
        <tbody>
          {currentItems.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.description}</td>
              <td>{r.subCategoryName || r.subCategoryId}</td>
              <td>{r.productCount ?? 0}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(r)}><i className="pi pi-pencil"></i></button>
                <button className="btn btn-sm btn-outline-danger"
                  disabled={(r.productCount ?? 0) > 0}
                  title={(r.productCount ?? 0) > 0 ? "Cannot delete reference with products" : "Delete Reference"}
                  onClick={() => setItemToDelete(r)}><i className="pi pi-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {showDialog && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editItem.id ? "Edit Reference" : "New Reference"}</h5>
                <button className="btn-close" onClick={() => setShowDialog(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Subcategory</label>
                  <select className="form-select" value={editItem.subCategoryId || ""}
                    onChange={(e) => setEditItem({ ...editItem, subCategoryId: e.target.value })}>
                    <option value="">Select subcategory</option>
                    {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
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
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isActive"
                    checked={editItem.isActive ?? true}
                    onChange={(e) => setEditItem({ ...editItem, isActive: e.target.checked })} />
                  <label className="form-check-label" htmlFor="isActive">Active</label>
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

      {itemToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setItemToDelete(null)} disabled={deleting} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the reference <strong>"{itemToDelete.name}"</strong>? This action cannot be undone.</p>
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

export default References;

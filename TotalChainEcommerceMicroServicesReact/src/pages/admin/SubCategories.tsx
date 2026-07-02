import { useState, useEffect } from "react";
import { useSubCategories } from "../../hooks/useSubCategories";
import { categoriesService } from "../../services/categories.service";
import type { ISubCategory, ICategory } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const emptySub: Partial<ISubCategory> = { name: "", description: "", categoryId: "", isActive: true };

const SubCategories = () => {
  const { subCategories, loading, error, createSubCategory, updateSubCategory, deleteSubCategory } = useSubCategories();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<ISubCategory>>({ ...emptySub });
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<ISubCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    categoriesService.getAll().then(setCategories).catch(console.error);
  }, []);

  const filtered = subCategories.filter((s) =>
    s.name?.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  const openNew = () => { setEditItem({ ...emptySub }); setShowDialog(true); };
  const openEdit = (s: ISubCategory) => { setEditItem({ ...s }); setShowDialog(true); };

  const save = async () => {
    try {
      if (editItem.id) {
        await updateSubCategory(editItem as ISubCategory);
      } else {
        await createSubCategory(editItem);
      }
      setShowDialog(false);
    } catch { /* handled */ }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteSubCategory(itemToDelete.id);
      setItemToDelete(null);
    } catch { /* handled */ } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Subcategories</h2>
        <button className="btn btn-primary" onClick={openNew}>New Subcategory</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by name..."
          value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
      </div>
      <table className="table table-hover">
        <thead><tr><th>Name</th><th>Description</th><th>Category</th><th>References</th><th></th></tr></thead>
        <tbody>
          {currentItems.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>{s.categoryName || s.categoryId}</td>
              <td>{s.referenceCount ?? 0}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(s)}><i className="pi pi-pencil"></i></button>
                <button className="btn btn-sm btn-outline-danger"
                  disabled={(s.referenceCount ?? 0) > 0}
                  title={(s.referenceCount ?? 0) > 0 ? "Cannot delete subcategory with references" : "Delete Subcategory"}
                  onClick={() => setItemToDelete(s)}><i className="pi pi-trash"></i></button>
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
                <h5>{editItem.id ? "Edit Subcategory" : "New Subcategory"}</h5>
                <button className="btn-close" onClick={() => setShowDialog(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={editItem.categoryId || ""}
                    onChange={(e) => setEditItem({ ...editItem, categoryId: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                <p>Are you sure you want to delete the subcategory <strong>"{itemToDelete.name}"</strong>? This action cannot be undone.</p>
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

export default SubCategories;

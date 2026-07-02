import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import type { ICategory } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const emptyCategory: Partial<ICategory> = { name: "", description: "", isActive: true };

const Categories = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<ICategory>>({ ...emptyCategory });
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  const openNew = () => { setEditItem({ ...emptyCategory }); setShowDialog(true); };
  const openEdit = (cat: ICategory) => { setEditItem({ ...cat }); setShowDialog(true); };

  const save = async () => {
    try {
      if (editItem.id) {
        await updateCategory(editItem as ICategory);
      } else {
        await createCategory(editItem);
      }
      setShowDialog(false);
    } catch { /* handled by hook */ }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    } catch { /* handled */ } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categories</h2>
        <button className="btn btn-primary" onClick={openNew}>New Category</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by name..."
          value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      </div>

      <table className="table table-hover">
        <thead><tr><th>Name</th><th>Description</th><th>Subcategories</th><th></th></tr></thead>
        <tbody>
          {currentItems.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>{cat.subCategoryCount ?? 0}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(cat)}>
                  <i className="pi pi-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger"
                  disabled={(cat.subCategoryCount ?? 0) > 0}
                  title={(cat.subCategoryCount ?? 0) > 0 ? "Cannot delete category with subcategories" : "Delete Category"}
                  onClick={() => setCategoryToDelete(cat)}>
                  <i className="pi pi-trash"></i>
                </button>
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
                <h5>{editItem.id ? "Edit Category" : "New Category"}</h5>
                <button className="btn-close" onClick={() => setShowDialog(false)}></button>
              </div>
              <div className="modal-body">
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

      {categoryToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setCategoryToDelete(null)} disabled={deleting} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the category <strong>"{categoryToDelete.name}"</strong>? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCategoryToDelete(null)} disabled={deleting}>Cancel</button>
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

export default Categories;

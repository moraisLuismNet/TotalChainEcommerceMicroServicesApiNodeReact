import { useEffect, useState } from "react";
import { usersService } from "../../services/users.service";
import { useAuth } from "../../hooks/useAuth";
import type { IUser } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user: currentUser } = useAuth();
  const [editUser, setEditUser] = useState<Partial<IUser> | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await usersService.getAll();
        setUsers(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!userToDelete?.email) return;
    setDeleting(true);
    try {
      await usersService.delete(userToDelete.email);
      setUsers((prev) => prev.filter((u) => u.email !== userToDelete.email));
      setUserToDelete(null);
    } catch (err) { console.error(err); } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!editUser?.email) return;
    setError("");
    try {
      const updated = await usersService.update(editUser.email, { name: editUser.name, address: editUser.address, phoneNumber: editUser.phoneNumber });
      setUsers((prev) => prev.map((u) => u.email === updated.email ? updated : u));
      setEditUser(null);
    } catch (err: any) {
      setError(err?.message || "Failed to update user");
    }
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Users</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by email or role..."
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>
      <table className="table table-hover">
        <thead><tr><th>Email</th><th>Name</th><th>Role</th><th></th></tr></thead>
        <tbody>
          {currentItems.map((u) => (
            <tr key={u.email}>
              <td>{u.email}</td>
              <td>{u.name || "-"}</td>
              <td><span className={`badge ${u.role === "Admin" ? "bg-warning" : "bg-info"}`}>{u.role}</span></td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => setEditUser({ email: u.email, name: u.name, address: u.address, phoneNumber: u.phoneNumber })}>
                  <i className="pi pi-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    if (u.email === currentUser?.email) {
                      alert("You cannot delete yourself");
                    } else {
                      setUserToDelete(u);
                    }
                  }}
                  disabled={u.role === "Admin"}>
                  <i className="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {editUser && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit User</h5>
                <button className="btn-close" onClick={() => setEditUser(null)}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="text" className="form-control" value={editUser.email || ""} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={editUser.name || ""}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" value={editUser.address || ""}
                    onChange={(e) => setEditUser({ ...editUser, address: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" value={editUser.phoneNumber || ""}
                    onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setUserToDelete(null)} disabled={deleting} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the user <strong>"{userToDelete.email}"</strong>? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setUserToDelete(null)} disabled={deleting}>Cancel</button>
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

export default Users;

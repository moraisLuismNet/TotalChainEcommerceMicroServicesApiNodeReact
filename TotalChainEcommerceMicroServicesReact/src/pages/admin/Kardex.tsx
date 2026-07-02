import { useEffect, useState } from "react";
import { kardexService } from "../../services/kardex.service";
import { productsService } from "../../services/products.service";
import type { IKardexMovement, IProduct } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const Kardex = () => {
  const [movements, setMovements] = useState<IKardexMovement[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newMovement, setNewMovement] = useState({
    productId: "", quantity: 1, type: "Entry" as "Entry" | "Exit",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [movData, prodData] = await Promise.all([
          kardexService.getAll(),
          productsService.getAll(),
        ]);
        const productMap = new Map(prodData.map((p) => [p.id, p]));
        setMovements(movData.map((m) => ({
          ...m,
          productName: productMap.get(m.productId)?.name || m.productName,
          productCode: productMap.get(m.productId)?.code || m.productCode,
        })));
        setProducts(prodData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = movements.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.productName?.toLowerCase().includes(term) ||
      m.productCode?.toLowerCase().includes(term) ||
      m.movementType?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  const handleRegisterMovement = async () => {
    try {
      if (newMovement.type === "Entry") {
        await kardexService.registerEntry(newMovement.productId, newMovement.quantity);
      } else {
        await kardexService.registerExit(newMovement.productId, newMovement.quantity);
      }
      const data = await kardexService.getAll();
      setMovements(data);
      setShowDialog(false);
    } catch (err) { console.error(err); }
  };

  const movementBadge = (type: string) => {
    return type === "Entry" ? "bg-success" : "bg-danger";
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Inventory Kardex</h2>
        <button className="btn btn-primary" onClick={() => setShowDialog(true)}>New Movement</button>
      </div>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by product, code or type..."
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>
      <table className="table table-hover">
        <thead>
          <tr><th>Date</th><th>Product</th><th>Code</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th></tr>
        </thead>
        <tbody>
          {currentItems.map((m) => (
            <tr key={m.id}>
              <td>{new Date(m.date).toLocaleDateString()}</td>
              <td>{m.productName || `Product #${m.productId}`}</td>
              <td>{m.productCode || "-"}</td>
              <td><span className={`badge ${movementBadge(m.movementType)}`}>{m.movementType}</span></td>
              <td>{m.quantity}</td>
              <td>{m.stockBefore}</td>
              <td className="fw-bold">{m.stockAfter}</td>
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
                <h5>New Kardex Movement</h5>
                <button className="btn-close" onClick={() => setShowDialog(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Product</label>
                  <select className="form-select" value={newMovement.productId}
                    onChange={(e) => setNewMovement({ ...newMovement, productId: e.target.value })}>
                    <option value="">Select product</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={newMovement.type}
                    onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value as "Entry" | "Exit" })}>
                    <option value="Entry">Entry (Purchase)</option>
                    <option value="Exit">Exit (Sale)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-control" min="1" value={newMovement.quantity}
                    onChange={(e) => setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) || 1 })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDialog(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleRegisterMovement}>Register</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kardex;

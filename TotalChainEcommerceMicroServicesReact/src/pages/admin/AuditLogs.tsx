import { useEffect, useState, Fragment } from "react";
import { auditLogsService } from "../../services/audit-logs.service";
import type { IAuditLog } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const safeJson = (val: string | null | undefined) => {
  if (!val) return null;
  try { return JSON.parse(val); } catch { return val; }
};

const fmtDate = (d: string) => {
  try { return new Date(d).toLocaleString(); } catch { return d; }
};

const AuditLogs = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await auditLogsService.getAll();
        setLogs(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = logs.filter((l) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.entityName?.toLowerCase().includes(term) ||
      l.action?.toLowerCase().includes(term) ||
      l.changedBy?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  const actionBadge = (action: string) => {
    const map: Record<string, string> = { Added: "bg-success", Modified: "bg-warning text-dark", Deleted: "bg-danger" };
    return map[action] || "bg-secondary";
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Audit Logs</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by entity, action or user..."
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>
      {currentItems.length > 0 ? (
        <table className="table table-hover">
          <thead>
            <tr><th>Date</th><th>Entity</th><th>ID</th><th>Action</th><th></th></tr>
          </thead>
          <tbody>
            {currentItems.map((log) => (
              <Fragment key={log.id}>
                <tr style={{ cursor: "pointer" }}
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                  <td>{fmtDate(log.changedAt)}</td>
                  <td>{log.entityName}</td>
                  <td>{log.entityId}</td>
                  <td><span className={`badge ${actionBadge(log.action)}`}>{log.action}</span></td>
                  <td><i className={`pi pi-chevron-${expandedLog === log.id ? "up" : "down"}`}></i></td>
                </tr>
                {expandedLog === log.id && (
                  <tr key={`detail-${log.id}`}>
                    <td colSpan={5}>
                      <div className="row">
                        {log.oldValues && (
                          <div className="col-md-6">
                            <h6>Old Values</h6>
                            <pre className="bg-light p-2 rounded small">{JSON.stringify(safeJson(log.oldValues), null, 2)}</pre>
                          </div>
                        )}
                        {log.newValues && (
                          <div className="col-md-6">
                            <h6>New Values</h6>
                            <pre className="bg-light p-2 rounded small">{JSON.stringify(safeJson(log.newValues), null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">No audit logs found</div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default AuditLogs;

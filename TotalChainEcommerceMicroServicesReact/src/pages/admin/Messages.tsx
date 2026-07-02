import { useEffect, useState } from "react";
import { messagesService } from "../../services/messages.service";
import type { IMessage } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const Messages = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sessionStatus, setSessionStatus] = useState<string>("loading");
  const [linkedPhone, setLinkedPhone] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [linkingLoading, setLinkingLoading] = useState(false);

  const fetchStatus = async (initial = false) => {
    try {
      const data = await messagesService.getSessionStatus();
      setSessionStatus(data?.status || "disconnected");
      setLinkedPhone(data?.phone || null);
      if (data?.status === "ready") {
        setQrCode(null);
      }
    } catch {
      if (initial) console.warn("WhatsApp session status unavailable");
      setSessionStatus("disconnected");
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messagesService.getAll();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    fetchStatus(true);
    const interval = setInterval(() => { fetchStatus(); }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkDevice = async () => {
    setLinkingLoading(true);
    setQrCode(null);
    setShowQrModal(true);
    try {
      const data = await messagesService.linkDevice();
      if (data?.qrCode) {
        setQrCode(data.qrCode);
      } else {
        console.error("No QR code in link response", data);
      }
    } catch (err) {
      console.error("Failed to link device", err);
    } finally {
      setLinkingLoading(false);
    }
  };

  const filtered = messages.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return m.phoneNumber?.includes(term) || new Date(m.createdAt).toLocaleDateString().toLowerCase().includes(term);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { Sent: "bg-success", Pending: "bg-warning text-dark", Failed: "bg-danger" };
    return map[status] || "bg-secondary";
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">WhatsApp Messages</h2>

      {/* WhatsApp Session Status Card */}
      <div className="card mb-4 border-0 shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 className="mb-2 d-flex align-items-center gap-2">
              <i className="pi pi-whatsapp text-success" style={{ fontSize: "1.3rem" }}></i>
              WhatsApp Gateway Connection
            </h5>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {sessionStatus === "loading" && (
                <span className="badge bg-secondary px-3 py-2">Checking status...</span>
              )}
              {sessionStatus === "ready" && (
                <>
                  <span className="badge bg-success px-3 py-2">Connected</span>
                  {linkedPhone && (
                    <span className="text-muted">
                      Linked to: <strong>+{linkedPhone}</strong>
                    </span>
                  )}
                </>
              )}
              {sessionStatus !== "loading" && sessionStatus !== "ready" && (
                <>
                  <span className="badge bg-danger px-3 py-2">Disconnected</span>
                  <span className="text-muted small">
                    (Session state: <span className="font-monospace text-dark">{sessionStatus}</span>)
                  </span>
                </>
              )}
            </div>
          </div>
          {sessionStatus !== "ready" && (
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={handleLinkDevice}
              disabled={linkingLoading}
              style={{ fontWeight: 600 }}
            >
              {linkingLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Generating QR...
                </>
              ) : (
                <>
                  <i className="pi pi-qrcode"></i> Link Device
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by phone or date..."
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr><th>Date</th><th>Phone</th><th>Message</th><th>Order ID</th><th>Status</th></tr>
          </thead>
          <tbody>
            {currentItems.map((m) => (
              <tr key={m.notificationQueueId}>
                <td className="text-nowrap">{new Date(m.createdAt).toLocaleDateString()}</td>
                <td>{m.phoneNumber}</td>
                <td className="text-truncate" style={{ maxWidth: "250px" }}>{m.message}</td>
                <td>{m.orderId}</td>
                <td><span className={`badge ${statusBadge(m.status)}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* QR Code Modal Overlay */}
      {showQrModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title font-weight-bold">WhatsApp Device Link</h5>
                <button type="button" className="btn-close" onClick={() => setShowQrModal(false)}></button>
              </div>
              <div className="modal-body text-center pt-2">
                <p className="text-muted mb-4">Open WhatsApp on your phone, go to Settings &gt; Linked Devices, and scan this QR code.</p>
                {qrCode ? (
                  <div className="p-3 bg-white d-inline-block border rounded shadow-sm mb-3">
                    <img src={qrCode} alt="WhatsApp Link QR Code" style={{ maxWidth: "250px", display: "block" }} />
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center p-5">
                    <div className="spinner-border text-success mb-3" role="status" />
                    <span className="text-muted">Initializing OpenWA session &amp; generating QR code...</span>
                  </div>
                )}
                <div className="mt-2">
                  <span className="text-muted small">
                    Status: <strong className="text-primary font-monospace">{sessionStatus}</strong>
                  </span>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary w-100" onClick={() => setShowQrModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

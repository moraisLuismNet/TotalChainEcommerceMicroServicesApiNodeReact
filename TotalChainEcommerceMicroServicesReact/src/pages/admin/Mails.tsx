import { useEffect, useState } from "react";
import { mailsService } from "../../services/mails.service";
import type { IMailMessage } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";

const Mails = () => {
  const [mails, setMails] = useState<IMailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await mailsService.getAll();
        setMails(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = mails.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.toEmail?.toLowerCase().includes(term) ||
      new Date(m.createdAt).toLocaleDateString().toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Emails</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by email or date..."
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>
      <table className="table table-hover">
        <thead>
          <tr><th>Date</th><th>To</th><th>Subject</th><th>Type</th></tr>
        </thead>
        <tbody>
          {currentItems.map((m) => (
            <tr key={m.idEmailQueue}>
              <td className="text-nowrap">{new Date(m.createdAt).toLocaleDateString()}</td>
              <td>{m.toEmail}</td>
              <td className="text-truncate" style={{ maxWidth: "250px" }}>{m.subject}</td>
              <td><span className="badge bg-info">{m.emailType}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Mails;

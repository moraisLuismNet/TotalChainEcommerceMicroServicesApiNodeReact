import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesService } from "../../services/categories.service";
import type { ICategory } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";
import Footer from "../../components/layout/Footer";

const ListCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await categoriesService.getAll();
        setCategories(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <>
      <div className="pb-4" style={{ backgroundColor: "#111827", paddingTop: "2rem" }}>
        <div className="container text-center">
          <h1 className="display-5 fw-bold text-white mb-4">Find your favorite products</h1>
          <p className="lead text-white mx-auto" style={{ maxWidth: "600px" }}>
            Explore our curated selection of categories and discover amazing products for every need.
          </p>
        </div>
      </div>
      <div className="container pt-5 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Available Categories</h2>
          <div className="col-md-4 px-0">
            <input type="text" className="form-control" placeholder="Search by name..."
              value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>

        {currentItems.length === 0 ? (
          <div className="alert alert-info">No categories found</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentItems.map((cat) => (
              <div key={cat.id} className="col">
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
                  style={{ cursor: (cat.subCategoryCount ?? 0) > 0 ? "pointer" : "default" }}
                  onClick={() => {
                    if ((cat.subCategoryCount ?? 0) > 0) navigate(`/list-subcategories/${cat.id}`);
                  }}>
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold">{cat.name}</h5>
                    <p className="card-text text-muted small mb-3">{cat.description}</p>
                    <div className="mt-auto d-flex flex-column gap-3">
                      <div className="text-secondary small">
                        <i className="pi pi-box me-1"></i>
                        <span className="fw-semibold">{cat.subCategoryCount || 0}</span> SubCategories
                      </div>
                      {(cat.subCategoryCount ?? 0) > 0 && (
                        <button className="btn btn-outline-primary w-100"
                          onClick={(e) => { e.stopPropagation(); navigate(`/list-subcategories/${cat.id}`); }}>
                          View SubCategories
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
      </div>
      <Footer />
    </>
  );
};

export default ListCategories;

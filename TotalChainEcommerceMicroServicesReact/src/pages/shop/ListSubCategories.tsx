import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subcategoriesService } from "../../services/subcategories.service";
import type { ISubCategory } from "../../interfaces/ecommerce.interfaces";
import Pagination from "../../components/common/Pagination";
import Footer from "../../components/layout/Footer";

const ListSubCategories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState<ISubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = categoryId
          ? await subcategoriesService.getByCategoryId(categoryId)
          : await subcategoriesService.getAll();
        setSubcategories(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [categoryId]);

  const filtered = subcategories.filter((sc) =>
    sc.name.toLowerCase().includes(searchText.toLowerCase())
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
          <h2 className="fw-bold">Available SubCategories</h2>
          <div className="col-md-4 px-0">
            <input type="text" className="form-control" placeholder="Search by name..."
              value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>

        {currentItems.length === 0 ? (
          <div className="alert alert-info">No subcategories found</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentItems.map((sub) => (
              <div key={sub.id} className="col">
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
                  style={{ cursor: (sub.referenceCount ?? 0) > 0 ? "pointer" : "default" }}
                  onClick={() => {
                    if ((sub.referenceCount ?? 0) > 0) navigate(`/list-references/${sub.id}`);
                  }}>
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold">{sub.name}</h5>
                    <p className="card-text text-muted small mb-3">{sub.description}</p>
                    <div className="mt-auto d-flex flex-column gap-3">
                      <div className="text-secondary small">
                        <i className="pi pi-box me-1"></i>
                        <span className="fw-semibold">{sub.referenceCount || 0}</span> References
                      </div>
                      {(sub.referenceCount ?? 0) > 0 && (
                        <button className="btn btn-outline-primary w-100"
                          onClick={(e) => { e.stopPropagation(); navigate(`/list-references/${sub.id}`); }}>
                          View References
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

export default ListSubCategories;

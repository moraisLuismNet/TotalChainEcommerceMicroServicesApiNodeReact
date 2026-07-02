const Footer = () => {
  return (
    <footer className="text-white pt-4 pb-3" style={{ backgroundColor: "#111827" }}>
      <div className="container">
        <div className="row g-4 mb-3">
          <div className="col-12 col-md-6">
            <a href="/" className="d-flex align-items-center mb-2 text-decoration-none">
              <img src="/TotalChainEcommerce_bn.png" alt="TotalChainEcommerce Logo"
                style={{ height: "40px" }} />
              <span className="ms-2 fs-2 fw-bold text-white">TotalChainEcommerce</span>
            </a>
            <p className="small text-secondary" style={{ maxWidth: "350px" }}>
              Complete e-commerce solution for all your shopping needs.
            </p>
          </div>
          <div className="col-12 col-md-3">
            <h6 className="fw-semibold mb-2 text-white">Contact Us</h6>
            <ul className="list-unstyled text-secondary small">
              <li>info@totalchainecommerce.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="pt-3 border-top border-secondary d-flex justify-content-between small text-secondary" style={{ opacity: 0.5 }}>
          <p className="mb-0">&copy; {new Date().getFullYear()} TotalChainEcommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

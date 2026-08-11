function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '14px' }}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <defs>
                  <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="20" fill="url(#footer-logo-grad)" />
                <path d="M20 10L25 15H22V25H18V15H15L20 10Z" fill="white" />
                <path d="M12 28H28V30H12V28Z" fill="white" />
              </svg>
              <span style={{ marginLeft: '10px', fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '20px', color: '#fff' }}>FoodShare</span>
            </div>
            <p>Connecting surplus food with people in need while reducing food waste across India.</p>
          </div>

          <div className="footer-col">
            <h3>Platform</h3>
            <a href="#">How It Works</a>
            <a href="#">Donate Food</a>
            <a href="#">Request Food</a>
            <a href="#">Volunteer</a>
          </div>

          <div className="footer-col">
            <h3>Company</h3>
            <a href="#">About Us</a>
            <a href="#">Impact</a>
            <a href="#">Contact</a>
            <a href="#">Blog</a>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 FoodShare. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

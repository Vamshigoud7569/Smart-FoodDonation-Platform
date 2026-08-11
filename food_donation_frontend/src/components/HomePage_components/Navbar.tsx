import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">

          <Link to="/" className="logo">
            <span className="logo-text"><span>Food</span>Share</span>
          </Link>

          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#impact" className="nav-link">Impact</a>
            <a href="#about" className="nav-link">About</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link cta">Get Started</Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;

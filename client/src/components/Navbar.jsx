import { Link } from 'react-router-dom';
import { FaRunning, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-mark">
            <img src="/logo.png" alt="Sports Meet logo" />
          </span>
          <h6>Blue Star</h6>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/categories">Results</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="admin-link"
              >
                Logout
              </a>
            </>
          ) : (
            <Link to="/admin/login" className="admin-link">
              <FaUserShield />
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

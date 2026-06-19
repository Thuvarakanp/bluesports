import { Link } from 'react-router-dom';
import { FaArrowRight, FaTrophy, FaRunning, FaUsers, FaMedal } from 'react-icons/fa';

function Home() {
  return (
    <div className="hero">
      <div className="hero-logo-wrap">
        <div className="hero-logo-ring">
          <img src="/logo.png" alt="Sports Meet logo" className="hero-logo-image" />
        </div>
      </div>
      <div className="hero-badge">
        <FaTrophy />
        <span>Championship Season</span>
      </div>
      <h1>Sports Meet 2026</h1>
      <p>
        Celebrate athletic excellence, explore every age group, and relive the moments
        that made this year unforgettable.
      </p>
      <div className="hero-actions">
        <Link to="/categories">
          <button className="hero-btn">
            <FaRunning />
            View Results
            <FaArrowRight />
          </button>
        </Link>
      </div>
      <div className="hero-stats">
        <div className="hero-stat-card">
          <FaTrophy />
          <strong>18</strong>
          <span>Events</span>
        </div>
        <div className="hero-stat-card">
          <FaUsers />
          <strong>120+</strong>
          <span>Athletes</span>
        </div>
      </div>
    </div>
  );
}

export default Home;

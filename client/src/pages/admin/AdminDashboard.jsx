import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTrophy, FaGlobe } from 'react-icons/fa';

function AdminDashboard() {
  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your sports meet events and results</p>
      </div>

      <div className="admin-dashboard">
        <Link to="/admin/events">
          <div className="admin-stat-card">
            <div className="stat-icon"><FaCalendarAlt /></div>
            <h3>Events</h3>
            <p>Manage age categories & sports</p>
          </div>
        </Link>

        <Link to="/admin/results">
          <div className="admin-stat-card">
            <div className="stat-icon"><FaTrophy /></div>
            <h3>Results</h3>
            <p>Add & manage winners</p>
          </div>
        </Link>

        <Link to="/categories">
          <div className="admin-stat-card">
            <div className="stat-icon"><FaGlobe /></div>
            <h3>View Site</h3>
            <p>See the public results page</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;

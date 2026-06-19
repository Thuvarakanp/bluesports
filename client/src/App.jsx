import { Routes, Route } from 'react-router-dom';
import { FaRunning, FaFutbol, FaBasketballBall, FaTrophy } from 'react-icons/fa';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AgeCategory from './pages/AgeCategory';
import Gender from './pages/Gender';
import SportCategory from './pages/SportCategory';
import Results from './pages/Results';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageResults from './pages/admin/ManageResults';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app-shell">
      <div className="background-decor">
        <span className="bg-icon bg-icon-1"><FaRunning /></span>
        <span className="bg-icon bg-icon-2"><FaFutbol /></span>
        <span className="bg-icon bg-icon-3"><FaBasketballBall /></span>
        <span className="bg-icon bg-icon-4"><FaTrophy /></span>
      </div>

      <Navbar />
      <div className="page-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<AgeCategory />} />
          <Route path="/categories/:ageCategoryId/gender" element={<Gender />} />
          <Route path="/categories/:ageCategoryId/:gender/sports" element={<SportCategory />} />
          <Route path="/results/:sportId" element={<Results />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="results" element={<ManageResults />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;

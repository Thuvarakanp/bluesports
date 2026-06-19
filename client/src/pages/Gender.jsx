import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaMars, FaVenus, FaArrowLeft } from 'react-icons/fa';

function Gender() {
  const { ageCategoryId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/categories')}>
        <FaArrowLeft />
        Back to Categories
      </button>

      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/categories">Categories</Link>
          <span>/</span>
          <span>Gender</span>
        </div>
        <h1>Select Gender</h1>
        <p>Choose a gender category to view available sports</p>
      </div>

      <div className="gender-cards">
        <div
          className="gender-card male"
          onClick={() => navigate(`/categories/${ageCategoryId}/Male/sports`)}
        >
          <div className="gender-icon"><FaMars /></div>
          <h2>Male</h2>
          <span>Competitions</span>
        </div>

        <div
          className="gender-card female"
          onClick={() => navigate(`/categories/${ageCategoryId}/Female/sports`)}
        >
          <div className="gender-icon"><FaVenus /></div>
          <h2>Female</h2>
          <span>Competitions</span>
        </div>
      </div>
    </div>
  );
}

export default Gender;

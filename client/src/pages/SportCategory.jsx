import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaRunning,
  FaBasketballBall,
  FaFutbol,
  FaVolleyballBall,
  FaTableTennis,
  FaSwimmer,
  FaStar
} from 'react-icons/fa';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';

const sportIcons = {
  default: <FaRunning />,
  football: <FaFutbol />,
  basketball: <FaBasketballBall />,
  volleyball: <FaVolleyballBall />,
  badminton: <FaTableTennis />,
  swimming: <FaSwimmer />
};

function SportCategory() {
  const { ageCategoryId, gender } = useParams();
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSports();
  }, [ageCategoryId, gender]);

  const fetchSports = async () => {
    try {
      const res = await axios.get(`/api/categories/sports/${ageCategoryId}/${gender}`);
      setSports(res.data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSportIcon = (name) => {
    const key = name.toLowerCase();
    if (key.includes('football') || key.includes('soccer')) return sportIcons.football;
    if (key.includes('basketball')) return sportIcons.basketball;
    if (key.includes('volley')) return sportIcons.volleyball;
    if (key.includes('badminton') || key.includes('table')) return sportIcons.badminton;
    if (key.includes('swim')) return sportIcons.swimming;
    return sportIcons.default;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading sports...</p>
      </div>
    );
  }

  return (
    <div>
      <button className="back-btn" onClick={() => navigate(`/categories/${ageCategoryId}/gender`)}>
        <FaArrowLeft />
        Back to Gender
      </button>

      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/categories">Categories</Link>
          <span>/</span>
          <Link to={`/categories/${ageCategoryId}/gender`}>Gender</Link>
          <span>/</span>
          <span>{gender} Sports</span>
        </div>
        <h1>{gender} Sports</h1>
        <p>Select a sport to view the winners</p>
      </div>

      {sports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FaStar /></div>
          <h3>No Sports Found</h3>
          <p>No sports have been added for this category yet.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {sports.map((sport) => (
            <CategoryCard
              key={sport.id}
              icon={getSportIcon(sport.name)}
              title={sport.name}
              description="View results"
              onClick={() => navigate(`/results/${sport.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SportCategory;

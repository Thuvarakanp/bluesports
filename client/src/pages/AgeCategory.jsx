import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChild, FaUserGraduate, FaRunning, FaStar } from 'react-icons/fa';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';

const ageIcons = [
  <FaChild key="child" />,
  <FaUserGraduate key="student" />,
  <FaRunning key="running" />,
  <FaStar key="star" />
];

function AgeCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories/age');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Select Age Category</h1>
        <p>Choose an age group to view sports and results</p>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FaStar /></div>
          <h3>No Categories Yet</h3>
          <p>Age categories will appear here once added by an admin.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.id}
              icon={ageIcons[index % ageIcons.length]}
              title={cat.name}
              description="Open category"
              onClick={() => navigate(`/categories/${cat.id}/gender`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AgeCategory;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function ManageEvents() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [ageCategories, setAgeCategories] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Modal state
  const [showAgeCatModal, setShowAgeCatModal] = useState(false);
  const [showSportModal, setShowSportModal] = useState(false);
  const [editingAgeCat, setEditingAgeCat] = useState(null);
  const [editingSport, setEditingSport] = useState(null);

  // Form state
  const [ageCatForm, setAgeCatForm] = useState({ name: ''});
  const [sportForm, setSportForm] = useState({ name: '', age_category_id: '', gender: 'Male' });

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ageCatRes, sportsRes] = await Promise.all([
        axios.get('/api/categories/age'),
        axios.get('/api/categories/sports', { headers })
      ]);
      setAgeCategories(ageCatRes.data);
      setSports(sportsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Age Category CRUD
  const openAgeCatModal = (cat = null) => {
    if (cat) {
      setEditingAgeCat(cat);
      setAgeCatForm({ name: cat.name });
    } else {
      setEditingAgeCat(null);
      setAgeCatForm({ name: ''});
    }
    setShowAgeCatModal(true);
  };

  const handleAgeCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgeCat) {
        await axios.put(`/api/categories/age/${editingAgeCat.id}`, ageCatForm, { headers });
        showMessage('Age category updated!');
      } else {
        await axios.post('/api/categories/age', ageCatForm, { headers });
        showMessage('Age category created!');
      }
      setShowAgeCatModal(false);
      fetchData();
    } catch (error) {
      showMessage('Error saving category', 'error');
    }
  };

  const deleteAgeCat = async (id) => {
    if (!confirm('Delete this age category? All related sports and results will be removed.')) return;
    try {
      await axios.delete(`/api/categories/age/${id}`, { headers });
      showMessage('Age category deleted!');
      fetchData();
    } catch (error) {
      showMessage('Error deleting category', 'error');
    }
  };

  // Sport CRUD
  const openSportModal = (sport = null) => {
    if (sport) {
      setEditingSport(sport);
      setSportForm({ name: sport.name, age_category_id: sport.age_category_id, gender: sport.gender });
    } else {
      setEditingSport(null);
      setSportForm({ name: '', age_category_id: ageCategories[0]?.id || '', gender: 'Male' });
    }
    setShowSportModal(true);
  };

  const handleSportSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSport) {
        await axios.put(`/api/categories/sports/${editingSport.id}`, sportForm, { headers });
        showMessage('Sport updated!');
      } else {
        await axios.post('/api/categories/sports', sportForm, { headers });
        showMessage('Sport created!');
      }
      setShowSportModal(false);
      fetchData();
    } catch (error) {
      showMessage('Error saving sport', 'error');
    }
  };

  const deleteSport = async (id) => {
    if (!confirm('Delete this sport? Related results will be removed.')) return;
    try {
      await axios.delete(`/api/categories/sports/${id}`, { headers });
      showMessage('Sport deleted!');
      fetchData();
    } catch (error) {
      showMessage('Error deleting sport', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <h1>Manage Events</h1>
        <p>Add, edit, and delete age categories and sports</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {/* Age Categories Section */}
      <div className="admin-toolbar">
        <h2>Age Categories</h2>
        <button className="btn btn-primary btn-sm" onClick={() => openAgeCatModal()}>
          + Add Category
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ageCategories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                
                <td>
                  <div className="table-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openAgeCatModal(cat)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteAgeCat(cat.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sports Section */}
      <div className="admin-toolbar" style={{ marginTop: '3rem' }}>
        <h2>Sports</h2>
        <button className="btn btn-primary btn-sm" onClick={() => openSportModal()}>
          + Add Sport
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sport</th>
              <th>Age Category</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sports.map((sport) => (
              <tr key={sport.id}>
                <td>{sport.name}</td>
                <td>{sport.age_category_name}</td>
                <td>{sport.gender}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openSportModal(sport)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteSport(sport.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Age Category Modal */}
      {showAgeCatModal && (
        <div className="modal-overlay" onClick={() => setShowAgeCatModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingAgeCat ? 'Edit' : 'Add'} Age Category</h2>
            <form onSubmit={handleAgeCatSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={ageCatForm.name}
                  onChange={(e) => setAgeCatForm({ ...ageCatForm, name: e.target.value })}
                  placeholder="e.g. Under 14"
                  required
                />
              </div>
              
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAgeCatModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAgeCat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sport Modal */}
      {showSportModal && (
        <div className="modal-overlay" onClick={() => setShowSportModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSport ? 'Edit' : 'Add'} Sport</h2>
            <form onSubmit={handleSportSubmit}>
              <div className="form-group">
                <label>Sport Name</label>
                <input
                  type="text"
                  value={sportForm.name}
                  onChange={(e) => setSportForm({ ...sportForm, name: e.target.value })}
                  placeholder="e.g. 100m Sprint"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age Category</label>
                <select
                  value={sportForm.age_category_id}
                  onChange={(e) => setSportForm({ ...sportForm, age_category_id: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {ageCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={sportForm.gender}
                  onChange={(e) => setSportForm({ ...sportForm, gender: e.target.value })}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSport ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEvents;

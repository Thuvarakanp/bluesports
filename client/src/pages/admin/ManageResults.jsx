import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaMedal, FaAward, FaPlus, FaFilePdf, FaTrash, FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function ManageResults() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploadingId, setUploadingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ sport_id: '', gold_winner: '', silver_winner: '', bronze_winner: '' });

  const fileInputRefs = useRef({});
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [resultsRes, sportsRes] = await Promise.all([
        axios.get('/api/results', { headers }),
        axios.get('/api/categories/sports', { headers })
      ]);
      setResults(resultsRes.data);
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

  const openModal = (result = null) => {
    if (result) {
      setEditing(result);
      setForm({ sport_id: result.sport_id, gold_winner: result.gold_winner || '', silver_winner: result.silver_winner || '', bronze_winner: result.bronze_winner || '' });
    } else {
      setEditing(null);
      setForm({ sport_id: sports[0]?.id || '', gold_winner: '', silver_winner: '', bronze_winner: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/results/${editing.id}`, form, { headers });
        showMessage('Result updated!');
      } else {
        await axios.post('/api/results', form, { headers });
        showMessage('Result created!');
      }
      setShowModal(false);
      fetchData();
    } catch {
      showMessage('Error saving result', 'error');
    }
  };

  const deleteResult = async (id) => {
    if (!confirm('Delete this result?')) return;
    try {
      await axios.delete(`/api/results/${id}`, { headers });
      showMessage('Result deleted!');
      fetchData();
    } catch {
      showMessage('Error deleting result', 'error');
    }
  };

  const handlePdfUpload = async (resultId, file) => {
    if (!file) return;
    setUploadingId(resultId);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      await axios.post(`/api/results/${resultId}/pdf`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      showMessage('PDF uploaded successfully!');
      fetchData();
    } catch {
      showMessage('Error uploading PDF', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemovePdf = async (resultId) => {
    if (!confirm('Remove this PDF?')) return;
    try {
      await axios.delete(`/api/results/${resultId}/pdf`, { headers });
      showMessage('PDF removed!');
      fetchData();
    } catch {
      showMessage('Error removing PDF', 'error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading results...</p></div>;

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="page-header">
        <h1>Manage Results</h1>
        <p>Add results and upload PDF result sheets for each sport</p>
      </div>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="admin-toolbar">
        <h2>All Results</h2>
        <button className="btn btn-primary btn-sm" onClick={() => openModal()}>
          <FaPlus /> Add Result
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sport</th>
              <th>Category</th>
              <th>Gender</th>
              <th><FaTrophy /> 1st</th>
              <th><FaMedal /> 2nd</th>
              <th><FaAward /> 3rd</th>
              <th><FaFilePdf /> PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.sport_name}</td>
                <td>{result.age_category_name}</td>
                <td>{result.gender}</td>
                <td>{result.gold_winner || '—'}</td>
                <td>{result.silver_winner || '—'}</td>
                <td>{result.bronze_winner || '—'}</td>
                <td>
                  <div className="pdf-cell">
                    {result.pdf_path ? (
                      <div className="pdf-actions">
                        <a href={result.pdf_path} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                          <FaFilePdf /> View
                        </a>
                        <button className="btn btn-secondary btn-sm" onClick={() => { if (fileInputRefs.current[result.id]) fileInputRefs.current[result.id].click(); }}>
                          <FaUpload /> Replace
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleRemovePdf(result.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={uploadingId === result.id}
                        onClick={() => { if (fileInputRefs.current[result.id]) fileInputRefs.current[result.id].click(); }}
                      >
                        <FaUpload /> {uploadingId === result.id ? 'Uploading...' : 'Upload PDF'}
                      </button>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      ref={(el) => { fileInputRefs.current[result.id] = el; }}
                      onChange={(e) => { if (e.target.files[0]) handlePdfUpload(result.id, e.target.files[0]); e.target.value = ''; }}
                    />
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openModal(result)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteResult(result.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><FaTrophy /></div>
          <h3>No Results Yet</h3>
          <p>Click "Add Result" to start adding winners.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit' : 'Add'} Result</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Sport</label>
                <select value={form.sport_id} onChange={(e) => setForm({ ...form, sport_id: e.target.value })} required>
                  <option value="">Select sport</option>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>{sport.name} ({sport.age_category_name} - {sport.gender})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label><FaTrophy /> 1st Place Winner</label>
                <input type="text" value={form.gold_winner} onChange={(e) => setForm({ ...form, gold_winner: e.target.value })} placeholder="1st place winner name" />
              </div>
              <div className="form-group">
                <label><FaMedal /> 2nd Place Winner</label>
                <input type="text" value={form.silver_winner} onChange={(e) => setForm({ ...form, silver_winner: e.target.value })} placeholder="2nd place winner name" />
              </div>
              <div className="form-group">
                <label><FaAward /> 3rd Place Winner</label>
                <input type="text" value={form.bronze_winner} onChange={(e) => setForm({ ...form, bronze_winner: e.target.value })} placeholder="3rd place winner name" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageResults;
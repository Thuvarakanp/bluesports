import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaMedal, FaFilePdf, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

function Results() {
  const { sportId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchResults(); }, [sportId]);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`/api/results/sport/${sportId}`);
      setResults(res.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading results...</p></div>;

  const result = results[0];

  return (
    <div className="results-page" style={{ alignItems: 'flex-start' }}>
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Sports
      </button>

      <div className="page-header results-header" style={{ textAlign: 'left', width: '100%' }}>
        <div className="results-header-chip">
          <FaTrophy />
          <span>Final Results</span>
        </div>
        <h1>{result ? result.sport_name : 'Results'}</h1>
        {result && <p>{result.age_category_name} • {result.gender}</p>}
      </div>

      {!result ? (
        <div className="empty-state" style={{ width: '100%' }}>
          <div className="empty-icon"><FaMedal /></div>
          <h3>No Results Yet</h3>
          <p>Results will be announced soon. Stay tuned!</p>
        </div>
      ) : !result.pdf_path ? (
        <div className="empty-state" style={{ width: '100%' }}>
          <div className="empty-icon"><FaFilePdf /></div>
          <h3>Results Coming Soon</h3>
          <p>The results sheet for this event hasn't been uploaded yet.</p>
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          {/* Action bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
  <a
    href={result.pdf_path}
    target="_blank"
    rel="noreferrer"
    className="btn btn-primary"
    style={{ width: 'auto', textDecoration: 'none' }}
  >
    <FaExternalLinkAlt /> Open in New Tab
  </a>

  <a
    href={result.pdf_path}
    download
    className="btn btn-secondary"
    style={{ textDecoration: 'none' }}
  >
    <FaDownload /> Download PDF
  </a>
</div>

          {/* PDF Viewer */}
          <div style={{
            background: 'rgba(6, 19, 43, 0.82)',
            border: '1px solid rgba(24, 209, 255, 0.12)',
            borderRadius: '18px',
            overflow: 'hidden',
            width: '100%',
            minHeight: '80vh'
          }}>
            <iframe
              src={result.pdf_path}
              title={`Results — ${result.sport_name}`}
              style={{ width: '100%', height: '80vh', border: 'none', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
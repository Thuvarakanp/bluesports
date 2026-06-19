import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// In production (Vercel) set VITE_API_URL to the deployed backend URL, e.g.
// https://sports-meet-server.onrender.com — all relative "/api/..." calls are
// then sent there. In local dev it stays empty and the Vite proxy handles it.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

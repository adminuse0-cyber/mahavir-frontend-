import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await axios.put(`${API_BASE_URL}/api/users/resetpassword/${token}`, { password });
      setMessage({ type: 'success', text: data.message });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Invalid or expired token. Please request a new link.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Set a new secure password for your Mahavir Creation account.</ScrollingText>
      </div>
      
      <Navbar />

      <div className="login-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', background: 'rgba(255, 255, 255, 0.05)', padding: '40px', borderRadius: '15px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>Reset Password</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '30px' }}>
            Choose a strong password with at least 6 characters.
          </p>

          {message.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px', 
              fontSize: '14px',
              textAlign: 'center',
              backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? '#22c55e' : '#ef4444',
              border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`
            }}>
              {message.text}
              {message.type === 'success' && <div style={{ marginTop: '10px' }}>Redirecting to login...</div>}
            </div>
          )}

          <label htmlFor="password" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>New Password</label>
          <div className="password-input-wrapper" style={{ marginBottom: '15px' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              placeholder="Min 6 characters" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px' }}
            />
            <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <label htmlFor="confirmPassword" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            placeholder="Repeat new password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: '25px', padding: '12px' }}
          />

          <button 
            type="submit" 
            className="button-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '12px' }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            <Link to="/login" style={{ color: '#b71c1c', textDecoration: 'none', fontWeight: '600' }}>Back to Login</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;

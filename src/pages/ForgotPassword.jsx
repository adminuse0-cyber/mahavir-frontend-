import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/users/forgotpassword`, { identifier });
      setMessage({ type: 'success', text: data.message });
      setIdentifier('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Forgot your password? Enter your registered mobile number or email to receive a reset link.</ScrollingText>
      </div>

      <Navbar />

      <div className="login-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', padding: '40px', borderRadius: '15px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#b71c1c' }}>Forgot Password</h2>
          <p style={{ textAlign: 'center', color: '#000000', fontSize: '14px', marginBottom: '30px' }}>
            We will send a secure reset link to your registered email address.
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
            </div>
          )}

          <label htmlFor="identifier" style={{ color: '#333', fontSize: '14px' }}>Mobile Number or Email</label>
          <input
            type="text"
            id="identifier"
            placeholder="e.g. 9876543210 or admin12@gmail.com"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={{ marginBottom: '20px', padding: '12px' }}
          />

          <button
            type="submit"
            className="button-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px' }}
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            <Link to="/login" style={{ color: '#b71c1c', textDecoration: 'none', fontWeight: '600' }}>Back to Login</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;

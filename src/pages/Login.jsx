import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) {
      setError('Please select your role');
      return;
    }
    try {
      const loginIdentifier = identifier.trim();
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, { 
        identifier: loginIdentifier, 
        role, 
        password 
      });
      
      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      // Redirect based on role
      const resRole = res.data.role;
      if (resRole === 'Admin') {
        navigate('/admin_dashboard');
      } else if (resRole === 'Merchant') {
        navigate('/merchant_dashboard');
      } else if (resRole === 'Worker') {
        navigate('/dashboard');
      } else if (resRole === 'Product Buy') {
        navigate('/home');
      } else {
        navigate('/owner_dashboard');
      }
    } catch (err) {
      console.error('--- LOGIN DEBUG DATA ---');
      console.log('Error Object:', err);
      if (err.response) {
        // Server responded with a status outside of 2xx
        console.log('Server Error Data:', err.response.data);
        console.log('Server Error Status:', err.response.status);
        if (err.response.status === 401) {
          setError('Incorrect Mobile/Email, Password, or Role selected.');
        } else {
          setError(err.response.data?.message || 'Server Error. Please try again later.');
        }
      } else if (err.request) {
        // Request was made but no response was received
        console.log('No response received from server. Check if backend is running on port 5000.');
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Welcome back to Mahavir Creation – login with your registered mobile number or email and password.</ScrollingText>
      </div>
      
      <Navbar />

      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <label htmlFor="role">Login As</label>
        <select id="role" name="role" required value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '12px' }}>
          <option value="">-- Select Role --</option>
          <option value="Admin">Admin</option>
          <option value="CEO / Owner">CEO / Owner</option>
          <option value="Merchant">Merchant</option>
          <option value="Worker">Worker</option>
          <option value="Product Buy">Product Buy (Customer)</option>
        </select>

        <label htmlFor="identifier">Mobile Number or Email</label>
        <input 
          type="text" 
          id="identifier" 
          name="identifier" 
          required 
          placeholder="Enter mobile or email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <div className="password-input-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            name="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '15px' }}>
          <Link to="/forgot-password" style={{ color: '#b71c1c', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>Forgot Password?</Link>
        </div>

        <button type="submit" className="button-primary" style={{ width: '100%', marginTop: '6px' }}>Login</button>
        <div className="small-text" style={{ textAlign: 'center', marginTop: '6px' }}>
          New to Mahavir Creation? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </>
  );
};

export default Login;

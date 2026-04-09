import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'ProductBuy' ? 'Product Buy' : '';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Worker fields
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState('');
  const [hours, setHours] = useState('');
  const [skills, setSkills] = useState([]);
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  const handleSkillChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSkills([...skills, value]);
    } else {
      setSkills(skills.filter(skill => skill !== value));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        role, name, email, phone, password,
        address, dob, age, experience, hours, skills: skills.join(',')
      };

      await axios.post(`${API_BASE_URL}/api/users/register`, payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Welcome to Mahavir Creation – register with your mobile number and start your journey with us.</ScrollingText>
      </div>

      <Navbar />

      <form onSubmit={handleRegister}>
        <h2>{role === 'Product Buy' ? 'Register to Shop' : 'Create Account'}</h2>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <label htmlFor="role">Register As</label>
        <select id="role" name="role" required value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Select Role --</option>
          <option value="Product Buy">Product Buy (Customer)</option>
          <option value="Merchant">Merchant</option>
          <option value="Worker">Worker</option>
        </select>

        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="phone">Mobile Number</label>
        <input type="text" id="phone" name="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label htmlFor="password">Password</label>
        <div className="password-input-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            name="password" 
            required 
            minLength="6"
            title="Password must be at least 6 characters"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        {role === 'Worker' && (
          <div className="worker-extra">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" rows="2" value={address} onChange={(e) => setAddress(e.target.value)}></textarea>

            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" value={dob} onChange={(e) => setDob(e.target.value)} />

            <label htmlFor="age">Age</label>
            <input type="number" id="age" name="age" min="16" max="80" value={age} onChange={(e) => setAge(e.target.value)} />

            <label htmlFor="experience">Working Experience</label>
            <input type="text" id="experience" name="experience" placeholder="e.g. 3 years in saree work" value={experience} onChange={(e) => setExperience(e.target.value)} />

            <label htmlFor="hours">How many hours you work</label>
            <input type="number" id="hours" name="hours" min="1" max="24" step="1" value={hours} onChange={(e) => setHours(e.target.value)} />

            <label>Best Work In (Select one or more)</label>
            <div className="product-grid">
              {['Saree', 'Lehenga', 'Suit', 'Kurti', 'Dupatta', 'Blouse', 'Petticoat', 'Women Bottom Wear'].map(item => (
                <label key={item}>
                  <input type="checkbox" value={item} onChange={handleSkillChange} /> {item}
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button type="button" className="button-secondary" onClick={() => navigate('/login')} style={{ flex: 1 }}>Back</button>
          <button type="submit" className="button-primary" style={{ flex: 1 }}>Register</button>
        </div>
        <div className="small-text" style={{ textAlign: 'center', marginTop: '10px' }}>
          Already have an account? <Link to="/login">Login here</Link><br/>
          <span style={{ display: 'block', marginTop: '4px' }}>Note: Admin access is reserved for company CEO and Co‑Founder only.</span>
        </div>
      </form>
    </>
  );
};

export default Register;

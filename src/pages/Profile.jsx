import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Profile.css';
import API_BASE_URL from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    age: '',
    experience: '',
    hours: '',
    skills: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (!info) {
      navigate('/login');
    } else {
      fetchProfile(JSON.parse(info));
    }
  }, [navigate]);

  const fetchProfile = async (userInfo) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, config);
      setUser(data);
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        dob: data.dob ? data.dob.split('T')[0] : '',
        age: data.age || '',
        experience: data.experience || '',
        hours: data.hours || '',
        skills: data.skills || ''
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const info = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${info.token}` } };
      const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, profileData, config);
      
      // Update local storage with new name/email
      const updatedInfo = { ...info, name: data.name, email: data.email };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    try {
      const info = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${info.token}` } };
      await axios.put(`${API_BASE_URL}/api/users/change-password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, config);
      
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Password change failed' });
    }
  };

  if (loading) return <div className="loading-screen" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', color: '#fff' }}>Loading Profile...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Update your information and manage account security</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ 
            padding: '12px 20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
            border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        <div className="profile-grid">
          {/* Personal Info Section */}
          <div className="profile-card">
            <h2 className="card-title">Personal Information</h2>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                  placeholder="For order bills and notifications"
                />
              </div>
              <div className="form-group">
                <label>Phone Number/Login</label>
                <input 
                  type="text" 
                  value={profileData.phone} 
                  readOnly 
                  className="readonly-input"
                  title="Phone number cannot be changed"
                />
                <small className="form-hint">Mobile number is fixed as it's your login ID</small>
              </div>
              
              {user.role === 'Worker' && (
                <>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea 
                      value={profileData.address} 
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label>DOB</label>
                      <input 
                        type="date" 
                        value={profileData.dob} 
                        onChange={(e) => setProfileData({...profileData, dob: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input 
                        type="number" 
                        value={profileData.age} 
                        onChange={(e) => setProfileData({...profileData, age: e.target.value})} 
                      />
                    </div>
                  </div>
                </>
              )}
              
              <button type="submit" className="button-primary" style={{ width: '100%', marginTop: '10px' }}>Update Details</button>
            </form>
          </div>

          {/* Password Section */}
          <div className="profile-card">
            <h2 className="card-title">Security & Password</h2>
            <p className="card-subtitle">Keep your account secure by using a strong password</p>
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showOldPass ? "text" : "password"} 
                    value={passwordData.oldPassword} 
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                    required 
                    placeholder="Enter current password"
                  />
                  <div className="password-toggle-icon" onClick={() => setShowOldPass(!showOldPass)}>
                    {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </div>
              <div className="wrapper-pass" style={{ display: 'grid', gap: '15px', marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      value={passwordData.newPassword} 
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                      required 
                      placeholder="Enter new password"
                    />
                    <div className="password-toggle-icon" onClick={() => setShowNewPass(!showNewPass)}>
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showConfirmPass ? "text" : "password"} 
                      value={passwordData.confirmPassword} 
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                      required 
                      placeholder="Verify new password"
                    />
                    <div className="password-toggle-icon" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="button-secondary" style={{ width: '100%', marginTop: '20px' }}>Change Password</button>
            </form>
            
            <div className="account-meta" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Account Role:</span>
                    <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>{user.role}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                    <span>Member Since:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

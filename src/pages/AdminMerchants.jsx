import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const AdminMerchants = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  
  // Edit user modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', role: '', skills: '', address: '', dob: '', age: '', experience: '', hours: '' });

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (!info) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(info);
      if (parsedUser.role !== 'Admin' && parsedUser.role !== 'Owner' && parsedUser.role !== 'CEO' && parsedUser.role !== 'CEO / Owner') {
        navigate('/login');
      } else {
        setUser(parsedUser);
      }
    }
  }, [navigate]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const resUsers = await axios.get(`${API_BASE_URL}/api/users/users`, config);
      setUsers(resUsers.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_BASE_URL}/api/users/${userId}`, config);
        alert("User deleted successfully!");
        fetchData();
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditFormData({
      name: u.name || '',
      phone: u.phone || '',
      role: u.role || '',
      skills: u.skills || '',
      address: u.address || '',
      dob: u.dob ? u.dob.split('T')[0] : '',
      age: u.age || '',
      experience: u.experience || '',
      hours: u.hours || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_BASE_URL}/api/users/${editingUser._id}`, editFormData, config);
      alert("User updated successfully!");
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const filteredUsers = users.filter(u => u.role === 'Merchant');

  if (!user) return null;

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Admin Panel – Merchant Management.</ScrollingText>
      </div>

      <div className="navbar">
        <div className="navbar-left">
          <Link to="/admin_dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div className="navbar-logo">MC</div>
            <div className="navbar-title">Mahavir Creation</div>
          </Link>
        </div>
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className="button-secondary" 
            onClick={() => navigate((user && (user.role === 'Owner' || user.role === 'CEO' || user.role === 'CEO / Owner')) ? '/owner_dashboard' : '/admin_dashboard')} 
            style={{ padding: '8px 16px', border: '1px solid #fff', color: '#fff', background: 'transparent' }}
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }} 
            className="button-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid #fff', color: '#fff', background: 'transparent' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="main-container">
        <div className="section">
          <h2>All Merchants</h2>
          <p className="small-text">Admin can review, edit, and delete merchant accounts here.</p>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.phone}</td>
                      <td>{u.role}</td>
                      <td style={{ display: 'flex', gap: '5px' }}>
                        <button className="button-primary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => openEditModal(u)}>Edit</button>
                        <button className="button-secondary" style={{ padding: '4px 8px', fontSize: '12px', background: '#e53935', color: '#fff', border: 'none' }} onClick={() => handleDeleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">No merchants found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', marginTop: '20px', marginBottom: '20px' }}>
             <h3>Edit User</h3>
             <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Name</label>
                <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} required />
                
                <label>Phone</label>
                <input type="text" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} required />
                
                <label>Role</label>
                <select value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})}>
                   <option value="Merchant">Merchant</option>
                   <option value="Worker">Worker</option>
                   <option value="Product Buy">Product Buy</option>
                   <option value="Admin">Admin</option>
                   <option value="CEO / Owner">CEO / Owner</option>
                </select>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                   <button type="button" className="button-secondary" style={{ flex: 1 }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                   <button type="submit" className="button-primary" style={{ flex: 1 }}>Save</button>
                </div>
             </form>
          </div>
        </div>
      )}

    </>
  );
};

export default AdminMerchants;

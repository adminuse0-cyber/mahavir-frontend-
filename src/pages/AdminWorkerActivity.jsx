import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const AdminWorkerActivity = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);

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

  const fetchEntries = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/work`, config);
      setEntries(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this work entry?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_BASE_URL}/api/work/${id}`, config);
        fetchEntries();
      } catch (error) {
        console.error(error);
        alert('Error deleting work entry');
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Admin Panel – Worker Activities (edit / delete).</ScrollingText>
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
          <h2>All Worker Work Entries</h2>
          <p className="small-text">Admin can update or delete any worker activity entry.</p>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Mobile</th>
                  <th>Date</th>
                  <th>Main Product</th>
                  <th>Sub Product</th>
                  <th>Work Option</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries && entries.length > 0 ? (
                  entries.map(e => (
                    <tr key={e._id}>
                      <td>{e.user ? e.user.name : ''}</td>
                      <td>{e.user ? e.user.phone : ''}</td>
                      <td>{e.date}</td>
                      <td>{e.workType}</td>
                      <td>{e.subProduct}</td>
                      <td>{e.workOption}</td>
                      <td>{e.quantity}</td>
                      <td>{e.price ? e.price.toFixed(2) : '0.00'}</td>
                      <td>{e.totalSalary ? e.totalSalary.toFixed(2) : '0.00'}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Link className="button-primary" style={{ padding: '6px 10px', textDecoration: 'none' }} to={`/admin_work_edit/${e._id}`}>Edit</Link>
                        <button className="button-primary" style={{ padding: '6px 10px', background: '#b61c1c', marginLeft: '6px', border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(e._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="10">No worker activities found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminWorkerActivity;

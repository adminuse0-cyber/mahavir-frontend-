import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const AdminMerchantBills = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);

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

  const fetchBills = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/bills`, config);
      setBills(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this bill?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_BASE_URL}/api/bills/${id}`, config);
        fetchBills();
      } catch (error) {
        console.error(error);
        alert('Error deleting bill');
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Admin Panel – Merchant Bills (view / edit / delete).</ScrollingText>
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
          <h2>All Generated Bills</h2>
          <p className="small-text">Bills are created when merchant clicks “Generate Bill”. Admin can edit line qty/price or delete the bill.</p>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Mobile</th>
                  <th>Type</th>
                  <th>Material</th>
                  <th>Grand Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills && bills.length > 0 ? (
                  bills.map(b => (
                    <tr key={b._id}>
                      <td>{b.merchantName}</td>
                      <td>{b.merchantPhone}</td>
                      <td>{b.billType}</td>
                      <td>{b.material}</td>
                      <td>{b.grandTotal ? b.grandTotal.toFixed(2) : '0.00'}</td>
                      <td>{new Date(b.createdAt).toLocaleString()}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Link className="button-primary" style={{ padding: '6px 10px', textDecoration: 'none' }} to={`/admin_bill_view/${b._id}`}>View</Link>
                        <Link className="button-primary" style={{ padding: '6px 10px', textDecoration: 'none', marginLeft: '6px' }} to={`/admin_bill_edit/${b._id}`}>Edit</Link>
                        <button className="button-primary" style={{ padding: '6px 10px', background: '#b61c1c', marginLeft: '6px', border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(b._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7">No bills found yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMerchantBills;

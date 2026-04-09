import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const MerchantSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  const { type, material, lines, grandTotal } = location.state || {};

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (!info) {
       navigate('/login');
    } else {
       const parsedUser = JSON.parse(info);
       if (parsedUser.role !== 'Merchant') {
         navigate('/login');
       } else {
         setUser(parsedUser);
       }
    }
    
    // Redirect back if no state passed
    if (!lines || lines.length === 0) {
      navigate('/merchant_dashboard');
    }
  }, [navigate, lines]);

  const handleGenerateBill = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        merchantUserId: user._id,
        merchantName: user.name,
        merchantPhone: user.phone,
        billType: type,
        material: material,
        lines: lines.map(l => ({
          productId: l.productId,
          category: l.category,
          subProduct: l.subProduct,
          unitPrice: l.unitPrice,
          qty: l.qty
        }))
      };

      const res = await axios.post(`${API_BASE_URL}/api/bills`, payload, config);
      
      // Navigate to the newly created invoice to view/print
      navigate(`/merchant_invoice/${res.data._id}`);
    } catch (error) {
       console.error(error);
       alert('Error generating bill. Please try again.');
    }
  };

  if (!user || !lines) return null;

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Mahavir Creation Merchant Panel – Review Bill Summary.</ScrollingText>
      </div>

      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div className="navbar-logo">MC</div>
            <div className="navbar-title">Mahavir Creation</div>
          </Link>
        </div>
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.02em' }}>Logged in as: {user.name} (Merchant)</div>
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
          <h2>Bill Summary</h2>
          <p className="small-text">Please verify the products and totals before generating the final bill.</p>

          <div style={{ marginBottom: '16px' }}>
            <strong>Merchant:</strong> {user.name} <br/>
            <strong>Mobile:</strong> {user.phone} <br/>
            <strong>Action:</strong> {type} - {material} Materials
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Sub Product</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td>{line.category}</td>
                    <td>{line.subProduct}</td>
                    <td>{line.unitPrice.toFixed(2)}</td>
                    <td>{line.qty}</td>
                    <td>{line.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="4" style={{ textAlign: 'right' }}>Grand Total</th>
                  <th>{grandTotal.toFixed(2)}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
            <button className="button-secondary" onClick={() => navigate('/merchant_dashboard')}>
              Back
            </button>
            <button className="button-primary" onClick={handleGenerateBill}>
              Generate Bill
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MerchantSummary;

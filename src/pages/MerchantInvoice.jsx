import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const MerchantInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [user, setUser] = useState(null);

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
  }, [navigate]);

  useEffect(() => {
    if (user && id) {
      const fetchBill = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const res = await axios.get(`${API_BASE_URL}/api/bills/${id}`, config);
          setBill(res.data);
        } catch (error) {
          console.error("Error fetching bill:", error);
        }
      };
      fetchBill();
    }
  }, [user, id]);

  if (!bill || !user) {
    return (
      <>
        <Navbar />
        <div className="main-container">
          <div className="section" style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>Loading Invoice...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="top-info-bar no-print">
        <ScrollingText>Mahavir Creation Merchant Panel – View and Print Invoice.</ScrollingText>
      </div>

      <div className="navbar no-print">
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

      <div className="main-container printable-area">
        <div className="section" style={{ padding: '40px', background: '#fff' }}>

          <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#b61c1c' }}>MAHAVIR CREATION</h1>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              333 to 350, BHAGYODAY INDUSTRIAL ESTATE, <br />
              Aai Mata Rd, Behind RAGUVEER MARKET, Surat, Gujarat 395010<br />
              Contact: +91 9879272162 | Email: mahavircre333@gmail.com
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Invoice Details:</h3>
              <p style={{ margin: '4px 0' }}><strong>Invoice No:</strong> {bill._id.slice(-6).toUpperCase()}</p>
              <p style={{ margin: '4px 0' }}><strong>Date:</strong> {new Date(bill.createdAt).toLocaleDateString()}</p>
              <p style={{ margin: '4px 0' }}><strong>Type:</strong> {bill.billType} ({bill.material})</p>
            </div>

            <div style={{ flex: 1, textAlign: 'right' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Bill To:</h3>
              <p style={{ margin: '4px 0' }}><strong>{bill.merchantName}</strong></p>
              <p style={{ margin: '4px 0' }}>Phone: {bill.merchantPhone}</p>
            </div>
          </div>

          <div className="admin-table-wrapper" style={{ boxShadow: 'none' }}>
            <table className="admin-table" style={{ border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th>Sr No.</th>
                  <th>Category</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.lines.map((line, index) => (
                  <tr key={line._id || index}>
                    <td>{index + 1}</td>
                    <td>{line.category}</td>
                    <td>{line.subProduct}</td>
                    <td>{line.qty}</td>
                    <td>{line.unitPrice.toFixed(2)}</td>
                    <td>{line.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="5" style={{ textAlign: 'right', fontSize: '16px', padding: '15px' }}>Grand Total (INR):</th>
                  <th style={{ fontSize: '16px', color: '#b61c1c', padding: '15px' }}>{bill.grandTotal.toFixed(2)}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
            <p style={{ margin: '5px 0' }}>Thank you for your business!</p>
            <p style={{ margin: '5px 0' }}>This is a computer-generated invoice and does not require a signature.</p>
          </div>

        </div>

        <div className="no-print" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
          <button className="button-secondary" onClick={() => navigate('/merchant_dashboard')} style={{ marginRight: '10px' }}>
            Back to Dashboard
          </button>
          <button className="button-primary" onClick={() => window.print()}>
            Print Invoice
          </button>
        </div>

        {/* CSS inline for print styling */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body { background: #fff; margin: 0; padding: 0; }
            .no-print { display: none !important; }
            .printable-area { width: 100% !important; margin: 0 !important; padding: 0 !important; }
            .main-container { max-width: 100% !important; box-shadow: none !important; }
            .section { box-shadow: none !important; border: none !important; padding: 10px !important; }
            .admin-table { width: 100% !important; border-collapse: collapse !important; }
            .admin-table th, .admin-table td { border: 1px solid #000 !important; }
          }
        `}} />
      </div>
    </>
  );
};

export default MerchantInvoice;


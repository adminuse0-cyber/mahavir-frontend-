import React, { useState } from 'react';
import axios from 'axios';
import './InquiryModal.css';
import API_BASE_URL from '../utils/api';

const InquiryModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/inquiries`, {
        ...formData,
        productName: product.name,
        productCategory: product.category
      });
      setSuccess(true);
    } catch (err) {
      alert('Failed to send Request. Make sure backend node server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inquiry-modal-overlay">
      <div className="inquiry-modal-content">
        <button className="inquiry-close" onClick={onClose}>&times;</button>
        
        {success ? (
          <div className="inquiry-success">
            <h3>Request Sent! 🎉</h3>
            <p>Our team will contact you shortly regarding the <strong>{product.name}</strong>.</p>
            <button onClick={onClose} className="button-primary" style={{marginTop: '20px'}}>Close Window</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="inquiry-form">
            <h2>Request Callback</h2>
            <div className="inquiry-product-details">
              <span className="badge">{product.category}</span>
              <strong>{product.name}</strong>
            </div>

            <label>Your Name *</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
            
            <label>Phone Number *</label>
            <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. +91 98765 43210" />

            <label>Additional Message (Optional)</label>
            <textarea rows="3" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="I am interested in bulk wholesale orders..."></textarea>
            
            <button type="submit" className="button-primary submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Request Callback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;

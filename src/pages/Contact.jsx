import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import API_BASE_URL from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', interest: 'Wholesale Purchase', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/contacts`, formData);
      alert('Message sent successfully!');
      setFormData({ name: '', phone: '', email: '', interest: 'Wholesale Purchase', message: '' });
    } catch (err) {
      alert('Failed to send message.');
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <h2>Contact Us</h2>
        <label>Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <label>Phone</label><input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        <label>Email</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <label>Area of Interest</label>
        <select value={formData.interest} onChange={e => setFormData({...formData, interest: e.target.value})}>
          <option>Wholesale Purchase</option>
          <option>Franchise Inquiry</option>
          <option>Export / International Order</option>
          <option>Manufacturing/Job Work</option>
        </select>
        <label>Message</label>
        <textarea rows="4" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
        <button type="submit" className="button-primary" style={{ width: '100%', marginTop: '10px' }}>Send Message</button>
      </form>
      <Footer />
    </>
  );
};

export default Contact;

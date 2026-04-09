import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import ScrollingText from '../components/ScrollingText';

const AdminWorkEdit = () => {
  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Admin Panel – Worker Edit (Placeholder).</ScrollingText>
      </div>
      <Navbar />
      <div className="main-container">
        <div className="section">
          <h2>Admin Work Edit</h2>
          <p>This page has been migrated. Full edit functionality to be implemented in another step.</p>
          <Link to="/admin_worker_activity" className="button-primary">Back to Worker Activities</Link>
        </div>
      </div>
    </>
  );
};

export default AdminWorkEdit;

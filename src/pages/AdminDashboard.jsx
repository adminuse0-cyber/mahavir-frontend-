import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const subMap = {
  "Saree": ["Dyed Fancy Matching Saree","Cotton Sarees","Rapier Silk Sarees","Printed Sarees","Paithani Sarees","Dyed Matching Sarees","Uniform Sarees"],
  "Lehenga": ["Surat Lehenga","Designer Lehenga","Indo Western Lehenga","Party Wear Lehenga","Wedding Lehenga","Bridal Lehenga"],
  "Suit": ["Ladies Designer Suits","Ladies Printed Suits","Embroidered Ladies Suit","Pakistani Suits","Jaipuri Suit","Punjabi Suits","Salwar Suit"],
  "Kurti": ["Surat Kurti","Surat Kurta","Nayra Cut Kurti","Ladies Kurti","Half Sleeve Kurtis","Long Kurti","Lucknowi Kurtis","Handloom Cotton Kurti"],
  "Dupatta": ["Cotton Dupatta","Chiffon Dupatta","Silk Dupatta","Net Dupatta","Velvet Dupatta","Georgette Dupatta","Rayon Dupatta","Satin Dupatta","Linen Dupatta","Printed Dupatta","Plain Dupatta","Embroidery Dupatta"],
  "Blouse": ["Designer Blouse","Ready Made Blouse","Stretchable Blouse","Blouse Pcs"],
  "Petticoat": ["Saree Shapewear Petticoat","Stitch Petticoat","Poplin Petticoat","Poplin Than Petticoat"],
  "Women Bottom Wear": ["Women Pajama","Women Shorts","Women Pants","Women Bottom Jeans","Women Bell Bottom Jeans","Women Leggings","Women Jeggings","Women Palazzo Pants"]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);

  // Edit user modal state
  const [selectedUserRoleFilter, setSelectedUserRoleFilter] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', role: '', skills: '' });

  // Form states
  const [prodCategory, setProdCategory] = useState('');
  const [prodSub, setProdSub] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  
  const [workOptionName, setWorkOptionName] = useState('Lace Sewing');
  const [workOptionPrice, setWorkOptionPrice] = useState('');

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (!info) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(info);
      if (parsedUser.role !== 'Admin') {
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

      const resContacts = await axios.get(`${API_BASE_URL}/api/contacts`, config);
      setContacts(resContacts.data);

      const resInquiries = await axios.get(`${API_BASE_URL}/api/inquiries`, config);
      setInquiries(resInquiries.data);

      const resProducts = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(resProducts.data);

      const resWorkOps = await axios.get(`${API_BASE_URL}/api/work/options`);
      setWorkOptions(resWorkOps.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Check if product exists to potentially update it (if required by logic, though controller upserts or we can leave id undefined to let it create/update based on category/name if we modify. Wait, the controller creates new if no id. Let's see if we should pass id.)
      // Find existing product matching category and name
      const existing = products.find(p => p.category === prodCategory && p.name === prodSub);
      const payload = {
        id: existing ? existing._id : undefined,
        category: prodCategory,
        name: prodSub,
        price: prodPrice
      };
      await axios.post(`${API_BASE_URL}/api/products`, payload, config);
      setProdCategory('');
      setProdSub('');
      setProdPrice('');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error updating product price');
    }
  };

  const handleUpdateInline = async (p, newPrice) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        id: p._id,
        category: p.category,
        name: p.name,
        price: Number(newPrice)
      };
      await axios.post(`${API_BASE_URL}/api/products`, payload, config);
      setProducts(prev => prev.map(prod => prod._id === p._id ? {...prod, priceSaleReady: Number(newPrice)} : prod));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveWorkOption = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_BASE_URL}/api/work/options`, {
        optionName: workOptionName,
        price: workOptionPrice
      }, config);
      setWorkOptionPrice('');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error updating work option price');
    }
  };

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
      skills: u.skills || ''
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

  const filteredUsers = selectedUserRoleFilter === 'All' 
    ? users 
    : users.filter(u => u.role === selectedUserRoleFilter);

  if (!user) return null;

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Admin Panel – manage registrations and customer enquiries for Mahavir Creation.</ScrollingText>
      </div>

      <div className="navbar">
        <div className="navbar-left">
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div className="navbar-logo">MC</div>
            <div className="navbar-title">Mahavir Creation</div>
          </Link>
        </div>
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffffff', letterSpacing: '0.02em' }}>Logged in as {user.name} (Admin)</div>
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
        
        {/* Activities Section */}
        <div className="section">
          <h2>Activities</h2>
          <p className="small-text">View and manage all worker activities and merchant generated bills.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link className="button-primary" to="/admin_worker_activity" style={{ textDecoration: 'none' }}>Manage Worker Activities</Link>
            <Link className="button-primary" to="/admin_merchant_bills" style={{ textDecoration: 'none' }}>Manage Merchant Bills</Link>
            <a className="button-primary" href="#registered-users" onClick={() => setSelectedUserRoleFilter('Merchant')} style={{ textDecoration: 'none' }}>Manage Merchant</a>
          </div>
        </div>

        {/* Registered Users Section */}
        <div className="section" id="registered-users">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <h2>Registered Users</h2>
            <select value={selectedUserRoleFilter} onChange={e => setSelectedUserRoleFilter(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
              <option value="All">All Users</option>
              <option value="Merchant">Merchants</option>
              <option value="Worker">Workers</option>
              <option value="Product Buy">Product Buy</option>
              <option value="Admin">Admins</option>
              <option value="CEO / Owner">CEO / Owner</option>
            </select>
          </div>
          <p className="small-text">All accounts created via the register page. Admin can review, edit, and delete access.</p>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Skills / Notes</th>
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
                      <td>{u.role === 'Worker' ? (u.skills || '') : u.role}</td>
                      <td style={{ display: 'flex', gap: '5px' }}>
                        <button className="button-primary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => openEditModal(u)}>Edit</button>
                        {u.role !== 'Admin' && u.role !== 'CEO / Owner' && u.role !== 'CEO' && (
                          <button className="button-secondary" style={{ padding: '4px 8px', fontSize: '12px', background: '#e53935', color: '#fff', border: 'none' }} onClick={() => handleDeleteUser(u._id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Callback Inquiries Section */}
        <div className="section">
          <h2>Product Inquiries (Callback Requests)</h2>
          <p className="small-text">Requests submitted by users from the Product Search catalog.</p>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Customer Name</th>
                  <th>Mobile</th>
                  <th>Message</th>
                  <th>Received At</th>
                </tr>
              </thead>
              <tbody>
                {inquiries && inquiries.length > 0 ? (
                  inquiries.map(iq => (
                    <tr key={iq._id}>
                      <td><span style={{fontWeight:'bold'}}>{iq.productName}</span><br/><small>{iq.productCategory}</small></td>
                      <td>{iq.name}</td>
                      <td>{iq.phone}</td>
                      <td style={{whiteSpace: 'pre-wrap'}}>{iq.message}</td>
                      <td>{new Date(iq.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">No product callback requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Enquiries Section */}
        <div className="section">
          <h2>Contact Enquiries</h2>
          <p className="small-text">Messages submitted from the Contact Us page.</p>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Interest</th>
                  <th>Message</th>
                  <th>Received At</th>
                </tr>
              </thead>
              <tbody>
                {contacts && contacts.length > 0 ? (
                  contacts.map(c => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.interest}</td>
                      <td style={{whiteSpace: 'pre-wrap'}}>{c.message}</td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">No enquiries yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Prices Section */}
        <div className="section">
          <h2>Product Prices (For Merchant Buy / Sale)</h2>
          <p className="small-text">All products are auto-generated. Update the prices directly in the table below.</p>

          <div className="admin-table-wrapper" style={{ marginTop: '16px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Sub Product</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map(p => (
                    <tr key={p._id}>
                      <td>{p.category}</td>
                      <td>{p.name}</td>
                      <td>
                         <input 
                           type="number" 
                           min="0" step="0.01" 
                           defaultValue={p.priceSaleReady || 0}
                           onBlur={(e) => {
                             if(Number(e.target.value) !== (p.priceSaleReady || 0)) {
                               handleUpdateInline(p, e.target.value);
                             }
                           }}
                           style={{ width: '120px', padding: '4px' }}
                         />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">Loading...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Work Option Prices Section */}
        <div className="section">
          <h2>Work Option Prices (For Workers)</h2>
          <p className="small-text">Admin decides the per‑piece price for worker work options. Workers can only select these 3 options for any product/sub‑product.</p>

          <form onSubmit={handleSaveWorkOption}>
            <div className="product-row product-row-header">
              <div>Work Option</div>
              <div>Price (per piece)</div>
              <div></div>
            </div>
            <div className="product-row">
              <div>
                <select required value={workOptionName} onChange={e => setWorkOptionName(e.target.value)}>
                  <option value="Lace Sewing">Lace Sewing</option>
                  <option value="Diamond Work">Diamond Work</option>
                  <option value="Iron Work">Iron Work</option>
                </select>
              </div>
              <div>
                <input type="number" min="0" step="0.01" placeholder="0.00" required value={workOptionPrice} onChange={e => setWorkOptionPrice(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button type="submit" className="button-primary">Save Price</button>
              </div>
            </div>
          </form>

          <div className="admin-table-wrapper" style={{ marginTop: '16px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Work Option</th>
                  <th>Price (per piece)</th>
                </tr>
              </thead>
              <tbody>
                {workOptions && workOptions.length > 0 ? (
                  workOptions.map(w => (
                    <tr key={w._id}>
                      <td>{w.optionName}</td>
                      <td>{w.price ? w.price.toFixed(2) : '0.00'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2">No work option prices found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
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
                </select>

                {editFormData.role === 'Worker' && (
                  <>
                    <label>Skills</label>
                    <input type="text" value={editFormData.skills} onChange={e => setEditFormData({...editFormData, skills: e.target.value})} />
                  </>
                )}

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

export default AdminDashboard;

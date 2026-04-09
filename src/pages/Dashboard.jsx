import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollingText from '../components/ScrollingText';
import API_BASE_URL from '../utils/api';

const subMap = {
  "Saree": ["Dyed Fancy Matching Saree", "Cotton Sarees", "Rapier Silk Sarees", "Printed Sarees", "Paithani Sarees", "Dyed Matching Sarees", "Uniform Sarees"],
  "Lehenga": ["Surat Lehenga", "Designer Lehenga", "Indo Western Lehenga", "Party Wear Lehenga", "Wedding Lehenga", "Bridal Lehenga"],
  "Suit": ["Ladies Designer Suits", "Ladies Printed Suits", "Embroidered Ladies Suit", "Pakistani Suits", "Jaipuri Suit", "Punjabi Suits", "Salwar Suit"],
  "Kurti": ["Surat Kurti", "Surat Kurta", "Nayra Cut Kurti", "Ladies Kurti", "Half Sleeve Kurtis", "Long Kurti", "Lucknowi Kurtis", "Handloom Cotton Kurti"],
  "Dupatta": ["Cotton Dupatta", "Chiffon Dupatta", "Silk Dupatta", "Net Dupatta", "Velvet Dupatta", "Georgette Dupatta", "Rayon Dupatta", "Satin Dupatta", "Linen Dupatta", "Printed Dupatta", "Plain Dupatta", "Embroidery Dupatta"],
  "Blouse": ["Designer Blouse", "Ready Made Blouse", "Stretchable Blouse", "Blouse Pcs"],
  "Petticoat": ["Saree Shapewear Petticoat", "Stitch Petticoat", "Poplin Petticoat", "Poplin Than Petticoat"],
  "Women Bottom Wear": ["Women Pajama", "Women Shorts", "Women Pants", "Women Bottom Jeans", "Women Bell Bottom Jeans", "Women Leggings", "Women Jeggings", "Women Palazzo Pants"]
};

// Extracted into smaller page component Dashboard.jsx
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [prices, setPrices] = useState({});
  const [workList, setWorkList] = useState([]);
  // Form fields
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [workType, setWorkType] = useState('Saree');
  const [subProduct, setSubProduct] = useState('');
  const [workOption, setWorkOption] = useState('Lace Sewing');
  const [quantity, setQuantity] = useState('');
  // Filter fields
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState([]);
  // Track which date rows are expanded in filter
  const [expandedDates, setExpandedDates] = useState({});
  // Per-date work detail cache
  const [dateDetails, setDateDetails] = useState({});

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (!info) {
      navigate('/login');
    } else {
      setUser(JSON.parse(info));
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPrices();
      fetchWork(date);
    }
  }, [user, date]);

  const fetchPrices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/work/options`);
      const pMap = {};
      res.data.forEach(item => pMap[item.optionName] = item.price);
      setPrices(pMap);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWork = async (viewDate) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/work/user?userId=${user._id}&date=${viewDate}`, config);
      setWorkList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSummary = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/work/summary?userId=${user._id}&fromDate=${fromDate}&toDate=${toDate}`, config);
      setSummary(res.data);
      // Reset expanded state when filter changes
      setExpandedDates({});
      setDateDetails({});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchSummary();
  };

  const handleAddWork = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_BASE_URL}/api/work`, {
        date,
        workType,
        subProduct,
        workOption,
        quantity: parseInt(quantity, 10)
      }, config);
      setQuantity('');
      fetchWork(date);
    } catch (error) {
      console.error(error);
      alert('Error adding work');
    }
  };

  const handleAddOther = () => {
    setWorkType('Saree');
    setSubProduct('');
    setWorkOption('Lace Sewing');
    setQuantity('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle expanded for a date row; fetch details if needed
  const handleToggleDay = async (d) => {
    const isOpen = expandedDates[d.date];
    setExpandedDates(prev => ({ ...prev, [d.date]: !isOpen }));
    if (!isOpen && !dateDetails[d.date]) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_BASE_URL}/api/work/user?userId=${user._id}&date=${d.date}`, config);
        setDateDetails(prev => ({ ...prev, [d.date]: res.data }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!user) return null;

  const currentPrice = prices[workOption] || 0;
  const viewTotal = workList.reduce((acc, w) => acc + w.totalSalary, 0);

  const sectionHeadingStyle = {
    textAlign: 'center',
    color: '#b61c1c',
    margin: '0 0 14px 0',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '0.3px'
  };

  const leftHeadingStyle = {
    textAlign: 'left',
    color: '#b61c1c',
    margin: '0 0 14px 0',
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '0.3px'
  };

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Mahavir Creation Worker Panel – log your daily work and quantities.</ScrollingText>
      </div>

      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div className="navbar-logo">MC</div>
            <div className="navbar-title">Mahavir Creation</div>
          </Link>
        </div>
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.02em' }}>Logged in as: {user.name} (Worker)</div>
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

        {/* â”€â”€ Add Work Section â”€â”€ */}
        <div className="section">
          <h2 style={leftHeadingStyle}>Work Dashboard</h2>
          {/* Highlighted Worker Info */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{
              flex: 1, minWidth: '160px',
              background: 'linear-gradient(135deg, #b61c1c 0%, #8b0000 100%)',
              color: '#fff', borderRadius: '10px',
              padding: '14px 20px', boxShadow: '0 4px 12px rgba(182,28,28,0.3)'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', opacity: 0.8, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Worker Name</div>
              <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.5px' }}>{user.name}</div>
            </div>
            <div style={{
              flex: 1, minWidth: '160px',
              background: '#fff',
              color: '#b61c1c', borderRadius: '10px',
              padding: '14px 20px',
              border: '2px solid #b61c1c',
              boxShadow: '0 4px 12px rgba(182,28,28,0.12)'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Mobile</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>{user.phone}</div>
            </div>
          </div>

          <h3 style={sectionHeadingStyle}>Work calculation</h3>

          <form onSubmit={handleAddWork} style={{ width: '100%', maxWidth: 'none', margin: '10px 0 0', boxShadow: 'none', padding: 0, background: 'transparent' }}>
            <style>
              {`
                .worker-work-grid {
                    display: grid !important;
                    grid-template-columns: 160px 1.4fr 1.4fr 1.1fr 140px 170px;
                    gap: 12px;
                    align-items: center;
                }
                .worker-work-grid > div { min-width: 0; }
                @media (max-width: 980px) {
                    .worker-work-grid { grid-template-columns: 1fr 1fr; }
                    .worker-work-grid.product-row-header { display: none !important; }
                }
              `}
            </style>

            <div className="product-row product-row-header worker-work-grid">
              <div>Date</div>
              <div>Main Product</div>
              <div>Sub Product</div>
              <div>Work Option</div>
              <div>Quantity</div>
              <div>Price (per piece)</div>
            </div>

            <div className="product-row worker-work-grid">
              <div>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <select required value={workType} onChange={e => {
                  setWorkType(e.target.value);
                  setSubProduct('');
                }}>
                  {Object.keys(subMap).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <select required value={subProduct} onChange={e => setSubProduct(e.target.value)}>
                  <option value="">-- Select Sub Product --</option>
                  {(subMap[workType] || []).map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <select required value={workOption} onChange={e => setWorkOption(e.target.value)}>
                  <option value="Lace Sewing">Lace Sewing</option>
                  <option value="Diamond Work">Diamond Work</option>
                  <option value="Iron Work">Iron Work</option>
                </select>
              </div>
              <div>
                <input type="number" min="1" required value={quantity} onChange={e => setQuantity(e.target.value)} />
              </div>
              <div>
                <input type="number" step="0.01" min="0" readOnly value={currentPrice.toFixed(2)} />
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="button-primary">Submit Work</button>
            </div>
          </form>

          <div className="small-text" style={{ marginTop: '8px' }}>
            Note: Total amount is calculated automatically in the system from quantity Ã— price.
          </div>

          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="button-secondary" onClick={handleAddOther}>Add Other Product</button>
          </div>

          {/* Today's Table */}
          <h3 style={{ ...sectionHeadingStyle, marginTop: '20px', fontSize: '17px' }}>Today's Work {date}</h3>
          <div className="admin-table-wrapper" style={{ marginTop: '8px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Main Product</th>
                  <th>Sub Product</th>
                  <th>Work Option</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {workList.map(w => (
                  <tr key={w._id}>
                    <td>{w.date}</td>
                    <td>{w.workType}</td>
                    <td>{w.subProduct}</td>
                    <td>{w.workOption}</td>
                    <td>{w.quantity}</td>
                    <td>{w.price.toFixed(2)}</td>
                    <td>{w.totalSalary.toFixed(2)}</td>
                  </tr>
                ))}
                {workList.length === 0 && (
                  <tr><td colSpan="7">No work submitted for selected date.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="6" style={{ textAlign: 'right' }}>Total</th>
                  <th>{viewTotal.toFixed(2)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* â”€â”€ Date Wise Work Filter (Separate Section) â”€â”€ */}
        <div className="section" style={{ marginTop: '18px' }}>
          <h3 style={sectionHeadingStyle}>Date Wise Work Filter</h3>

          <form onSubmit={handleFilter} style={{ width: '100%', maxWidth: 'none', margin: 0, boxShadow: 'none', padding: 0, background: 'transparent' }}>
            <div className="product-row product-row-header">
              <div>From Date</div>
              <div>To Date</div>
              <div></div>
            </div>
            <div className="product-row">
              <div><input type="date" required value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
              <div><input type="date" required value={toDate} onChange={e => setToDate(e.target.value)} /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button type="submit" className="button-primary">Filter</button>
              </div>
            </div>
          </form>

          <div className="admin-table-wrapper" style={{ marginTop: '12px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Qty</th>
                  <th>Total Amount</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((d, index) => (
                  <>
                    <tr key={`row-${index}`}>
                      <td><strong>{d.date}</strong></td>
                      <td>{d.total_qty}</td>
                      <td>{d.total_amount.toFixed(2)}</td>
                      <td>
                        <button
                          className="button-secondary"
                          style={{ padding: '6px 10px' }}
                          onClick={() => handleToggleDay(d)}
                        >
                          {expandedDates[d.date] ? 'Hide' : 'View Day'}
                        </button>
                      </td>
                    </tr>
                    {expandedDates[d.date] && (
                      <tr key={`detail-${index}`}>
                        <td colSpan="4" style={{ padding: '0', background: '#fdf4f4' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ background: '#b61c1c', color: '#fff' }}>
                                <th style={{ padding: '8px 10px', textAlign: 'left' }}>Main Product</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left' }}>Sub Product</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left' }}>Work Option</th>
                                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Rate</th>
                                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(dateDetails[d.date] || []).map((w, wi) => (
                                <tr key={wi} style={{ borderBottom: '1px solid #f0d4d4' }}>
                                  <td style={{ padding: '7px 10px', color: '#b61c1c', fontWeight: '600' }}>{w.workType}</td>
                                  <td style={{ padding: '7px 10px' }}>{w.subProduct}</td>
                                  <td style={{ padding: '7px 10px' }}>{w.workOption}</td>
                                  <td style={{ padding: '7px 10px', textAlign: 'center' }}>{w.quantity}</td>
                                  <td style={{ padding: '7px 10px', textAlign: 'center' }}>{w.price.toFixed(2)}</td>
                                  <td style={{ padding: '7px 10px', textAlign: 'center' }}>{w.totalSalary.toFixed(2)}</td>
                                </tr>
                              ))}
                              {(dateDetails[d.date] || []).length === 0 && (
                                <tr><td colSpan="6" style={{ padding: '10px', textAlign: 'center' }}>Loading...</td></tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {summary.length === 0 && (
                  <tr><td colSpan="4">No work found in selected date range.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="2" style={{ textAlign: 'right', color: '#b61c1c' }}>Range Total</th>
                  <th style={{ color: '#b61c1c' }}>{summary.reduce((acc, curr) => acc + curr.total_amount, 0).toFixed(2)}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;


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

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Form selections and data
  const [type, setType] = useState('Buy');
  const [material, setMaterial] = useState('Raw');
  const [lines, setLines] = useState([
    { id: Date.now(), category: '', subProduct: '', qty: 1, unitPrice: 0, amount: 0, productId: '' }
  ]);
  const [products, setProducts] = useState([]);

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
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const priceForProduct = (p, currentType, currentMaterial) => {
    let price = 0;
    if (p) {
      if (currentType === 'Buy' && currentMaterial === 'Raw') price = p.priceBuyRaw;
      else if (currentType === 'Buy' && currentMaterial === 'Ready') price = p.priceBuyReady;
      else if (currentType === 'Sale' && currentMaterial === 'Raw') price = p.priceSaleRaw;
      else if (currentType === 'Sale' && currentMaterial === 'Ready') price = p.priceSaleReady;
    }
    return price || 0;
  };

  // Recalculate everything when product or qty changes, or type/material changes
  useEffect(() => {
    setLines(prevLines => prevLines.map(line => {
      if (!line.subProduct) return line;
      
      const p = products.find(x => x.category === line.category && x.name === line.subProduct);
      const unitPrice = priceForProduct(p, type, material);
      const amount = unitPrice * line.qty;
      
      return { ...line, unitPrice, amount, productId: p ? p._id : '' };
    }));
  }, [type, material, products]);

  const handleLineChange = (id, field, value) => {
    setLines(prevLines => prevLines.map(line => {
      if (line.id !== id) return line;
      
      const updatedLine = { ...line, [field]: value };
      
      // If category changes, reset sub product
      if (field === 'category') {
        updatedLine.subProduct = '';
        updatedLine.unitPrice = 0;
        updatedLine.amount = 0;
        updatedLine.productId = '';
      }
      
      // If subProduct changes, lookup new price
      if (field === 'subProduct' || field === 'category') {
        const p = products.find(x => x.category === updatedLine.category && x.name === updatedLine.subProduct);
        updatedLine.unitPrice = priceForProduct(p, type, material);
        updatedLine.productId = p ? p._id : '';
      }
      
      // Must recalculate amount if qty or subProduct changed
      updatedLine.amount = updatedLine.unitPrice * Number(updatedLine.qty || 0);
      return updatedLine;
    }));
  };

  const addLine = () => {
    setLines([...lines, { id: Date.now(), category: '', subProduct: '', qty: 1, unitPrice: 0, amount: 0, productId: '' }]);
  };

  const removeLine = (id) => {
    const updated = lines.filter(l => l.id !== id);
    if (updated.length === 0) {
      setLines([{ id: Date.now(), category: '', subProduct: '', qty: 1, unitPrice: 0, amount: 0, productId: '' }]);
    } else {
      setLines(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty lines
    const validLines = lines.filter(l => l.category && l.subProduct && l.qty > 0);
    if (validLines.length === 0) {
      alert("Please add at least one valid product line.");
      return;
    }
    
    // Navigate to summary and pass state
    navigate('/merchant_summary', { 
      state: { 
        type, 
        material, 
        lines: validLines,
        grandTotal
      } 
    });
  };

  if (!user) return null;

  const grandTotal = lines.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Mahavir Creation Merchant Panel – manage your buying and selling activity.</ScrollingText>
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
          <div className="top-bar">
            <div>
              <h2 style={{ margin: 0 }}>Merchant Dashboard</h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '14px', marginBottom: '4px' }}>
                <div style={{
                  flex: 1, minWidth: '160px',
                  background: 'linear-gradient(135deg, #b61c1c 0%, #8b0000 100%)',
                  color: '#fff', borderRadius: '10px',
                  padding: '14px 20px', boxShadow: '0 4px 12px rgba(182,28,28,0.3)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', opacity: 0.8, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Merchant Name</div>
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
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 'none', margin: '10px 0 0', boxShadow: 'none', padding: 0, background: 'transparent' }}>
            <div className="product-row product-row-header">
              <div>Buy / Sale</div>
              <div>Material</div>
              <div></div>
              <div></div>
            </div>
            <div className="product-row">
              <div>
                <select value={type} onChange={e => setType(e.target.value)} required>
                  <option value="Buy">Buy</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
              <div>
                <select value={material} onChange={e => setMaterial(e.target.value)} required>
                  <option value="Raw">Raw Materials</option>
                  <option value="Ready">Ready Materials</option>
                </select>
              </div>
              <div></div>
              <div>
                <div style={{ textAlign: 'right' }}>
                  <button type="button" className="button-primary" style={{ padding: '8px 12px' }} onClick={addLine}>+ Add Product</button>
                </div>
              </div>
            </div>

            <div className="bill-table" style={{ marginTop: '14px' }}>
              <div className="bill-table-inner">
                <style>
                {`
                  .bill-row {
                    display: grid;
                    grid-template-columns: 1.4fr 1.8fr 0.95fr 0.8fr 1fr auto;
                    gap: 10px;
                    align-items: center;
                  }
                  @media (max-width: 640px) {
                    .bill-row {
                      grid-template-columns: 1.6fr 1.4fr 0.8fr;
                    }
                  }
                `}
                </style>
                <div className="bill-row bill-row-header">
                  <div>Category</div>
                  <div>Sub Product</div>
                  <div className="bill-col-hide-sm">Unit Price</div>
                  <div>Qty</div>
                  <div className="bill-col-hide-sm">Amount</div>
                  <div></div>
                </div>

                {lines.map((line) => (
                  <div key={line.id} className="bill-row" style={{ marginTop: '10px' }}>
                    <div>
                      <select required value={line.category} onChange={e => handleLineChange(line.id, 'category', e.target.value)}>
                        <option value="">-- Select --</option>
                        {Object.keys(subMap).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div>
                      <select required value={line.subProduct} onChange={e => handleLineChange(line.id, 'subProduct', e.target.value)}>
                        <option value="">-- Select Sub Product --</option>
                        {(subMap[line.category] || []).map(val => <option key={val} value={val}>{val}</option>)}
                      </select>
                    </div>
                    <div className="bill-col-hide-sm">
                      <input type="number" readOnly value={line.unitPrice.toFixed(2)} />
                    </div>
                    <div>
                      <input type="number" min="1" required value={line.qty} onChange={e => handleLineChange(line.id, 'qty', e.target.value)} />
                    </div>
                    <div className="bill-col-hide-sm">
                      <input type="number" readOnly value={line.amount.toFixed(2)} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <button type="button" className="button-primary" style={{ padding: '8px 10px', background: '#b61c1c', border: 'none' }} onClick={() => removeLine(line.id)}>Remove</button>
                    </div>
                  </div>
                ))}

                <div className="bill-row" style={{ marginTop: '12px' }}>
                  <div className="bill-col-hide-sm"></div>
                  <div className="bill-col-hide-sm"></div>
                  <div className="bill-col-hide-sm"></div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Grand Total</strong>
                  </div>
                  <div>
                    <input type="number" readOnly value={grandTotal.toFixed(2)} />
                  </div>
                  <div className="bill-col-hide-sm"></div>
                </div>

                <div className="bill-row" style={{ marginTop: '10px' }}>
                  <div className="bill-col-hide-sm"></div>
                  <div className="bill-col-hide-sm"></div>
                  <div className="bill-col-hide-sm"></div>
                  <div className="bill-col-hide-sm"></div>
                  <div className="bill-col-hide-sm"></div>
                  <div style={{ textAlign: 'right' }}>
                    <button type="submit" className="button-primary">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="small-text" style={{ marginTop: '10px' }}>
            Hint: Prices come from the admin panel product list. Click “Submit” to view summary, then “Generate Bill” to print (Print → Save as PDF).
          </div>
        </div>
      </div>
    </>
  );
};

export default MerchantDashboard;

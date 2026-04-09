import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import API_BASE_URL from '../utils/api';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }
    
    const userInfo = JSON.parse(userInfoStr);
    
    // Pre-fill from localStorage first for immediate results
    setFormData(prev => ({
      ...prev,
      name: userInfo.name || '',
      email: userInfo.email || '',
      phone: userInfo.phone || '',
    }));

    // Then fetch full profile from API to get latest info (like address)
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            address: data.address || prev.address
          }));
        }
      } catch (error) {
        console.error('Error fetching profile for auto-fill:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const subtotal = getCartTotal();
  const discount = formData.paymentMethod === 'Online' ? subtotal * 0.10 : 0;
  const finalTotal = subtotal - discount;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const orderData = {
      ...formData,
      items: cartItems,
      subtotal,
      discount,
      finalTotal
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setSuccess(true);
        clearCart();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Network error. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-success-container">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with Mahavir Creation.</p>
          <p>We've sent an order bill to <strong>{formData.email}</strong>.</p>
          <button className="btn-continue" onClick={() => navigate('/home')}>Return to Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Your cart is empty</h2>
          <button className="btn-continue" onClick={() => navigate('/products')}>Browse Products</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>Checkout</h1>
          <button className="button-secondary" onClick={() => navigate('/cart')}>Back to Cart</button>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Shipping & Payment Details</h2>
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="For sending the bill" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Complete Address</label>
                <textarea name="address" rows="3" required value={formData.address} onChange={handleChange}></textarea>
              </div>

              <div className="payment-method-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'Cash' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash" 
                      checked={formData.paymentMethod === 'Cash'} 
                      onChange={handleChange} 
                    />
                    <div className="option-content">
                      <span className="option-title">Cash on Delivery</span>
                      <span className="option-desc">Pay when you receive standard bill</span>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${formData.paymentMethod === 'Online' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Online" 
                      checked={formData.paymentMethod === 'Online'} 
                      onChange={handleChange} 
                    />
                    <div className="option-content">
                      <span className="option-title">Online Payment <span className="discount-badge">10% OFF</span></span>
                      <span className="option-desc">Pay via UPI / Card / Netbanking</span>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>
          
          <div className="order-summary-section">
            <h2>In Your Cart</h2>
            <div className="mini-cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="mini-cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="mini-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="mini-item-price">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-calculations">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discount > 0 && (
                <div className="calc-row discount-row">
                  <span>Online Discount (10%)</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="calc-row total-row">
                <span>Total to Pay</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button 
              className="btn-place-order" 
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order (₹${finalTotal.toLocaleString('en-IN')})`}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

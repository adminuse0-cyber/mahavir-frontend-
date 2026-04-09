import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  const handleMakeOrder = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo || userInfo === 'null' || userInfo === 'undefined') {
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo || userInfo === 'null' || userInfo === 'undefined') {
      setShowLoginModal(true);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const handleRemoveFromCart = (id) => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo || userInfo === 'null' || userInfo === 'undefined') {
      setShowLoginModal(true);
      return;
    }
    removeFromCart(id);
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1>Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is currently empty.</p>
            <Link to="/products" className="btn-continue">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div>
                      <h3>{item.name}</h3>
                      <p>₹{item.price.toLocaleString('en-IN')}</p>
                      <button className="btn-remove" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                  
                  <div className="item-quantity">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  
                  <div className="item-total">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary-section">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-total">
                <span>Total Estimating</span>
                <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <button className="btn-checkout" onClick={handleMakeOrder}>
                Make Order
              </button>
              <Link to="/products" className="btn-continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Custom Login Required Modal */}
      {showLoginModal && (
        <div className="login-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-modal-content" style={{
            background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>Login Required</h2>
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '1.05rem', lineHeight: '1.5' }}>
              You need to log in or create an account to process your order!
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowLoginModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #ccc', background: 'transparent', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancel
              </button>
              <button 
                onClick={() => navigate('/login')}
                style={{ padding: '10px 25px', border: 'none', background: '#3498db', color: 'white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Go to Login Page
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;

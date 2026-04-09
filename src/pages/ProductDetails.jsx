import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import productMap from '../data/productMap.json';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { category, productName } = useParams();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login' or 'role'
  const { cartItems, addToCart, updateQuantity } = useCart();
  
  // Find product from map
  const productList = productMap[category] || [];
  const product = productList.find(p => p.name === productName);
  const relatedProducts = productList.filter(p => p.name !== productName).slice(0, 10); // Show up to 10 related

  // Mock deterministic price based on product name
  const price = product ? (product.name.length * 50) + 200 : 0;
  
  // Check if item is in cart
  const productId = `${category}_${productName}`;
  const cartItem = cartItems.find(item => item.id === productId);

  const checkAccess = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr || userInfoStr === 'null' || userInfoStr === 'undefined') {
      setModalType('login');
      setShowLoginModal(true);
      return false;
    }
    const userInfo = JSON.parse(userInfoStr);
    if (userInfo.role !== 'Product Buy') {
      setModalType('role');
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!checkAccess()) return;

    addToCart({
      id: productId,
      name: productName,
      category: category,
      price: price,
      image: `/images/products/${encodeURIComponent(category)}/${encodeURIComponent(product.file)}`
    }, 1);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (!checkAccess()) return;
    updateQuantity(id, newQuantity);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when product changes
    if (product) {
      const imgPath = `/images/products/${encodeURIComponent(category)}/${encodeURIComponent(product.file)}`;
      setMainImage(imgPath);
    }
  }, [category, productName, product]);

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="not-found-message">Product not found.</div>
        <Footer />
      </div>
    );
  }

  const baseImagePath = `/images/products/${encodeURIComponent(category)}/${encodeURIComponent(product.file)}`;
  
  // If product has a "gallery" array in JSON, use those. Otherwise, simulate with base image.
  let thumbnails = [];
  if (product.gallery && product.gallery.length > 0) {
    thumbnails = [baseImagePath, ...product.gallery.map(img => `/images/products/${encodeURIComponent(category)}/${encodeURIComponent(img)}`)];
  } else {
    thumbnails = [
      baseImagePath,
      baseImagePath,
      baseImagePath,
      baseImagePath,
      baseImagePath
    ];
  }

  const handleRequestCall = () => {
    alert("Call request initiated for: " + productName + ". Our team will contact you shortly.");
  };

  return (
    <div className="product-details-page">
      <Navbar />

      <div className="product-details-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/home">Home</Link> &gt; <Link to="/products">{category}</Link> &gt; <span>{productName}</span>
        </div>

        <div className="product-main-section">
          
          {/* Left Side: Images */}
          <div className="product-image-gallery">
            <div className="thumbnail-list">
              {thumbnails.map((thumb, index) => (
                <div 
                  key={index} 
                  className={`thumbnail-item ${mainImage === thumb ? 'active' : ''}`}
                  onMouseEnter={() => setMainImage(thumb)}
                >
                  <img src={thumb} alt={`${productName} view ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="main-image-view">
              <img src={mainImage} alt={productName} />
            </div>
          </div>

          {/* Right Side: Details */}
            <div className="product-info-panel">
              <h1 className="product-title">{productName}</h1>
              <p className="product-category">Category: {category}</p>
              
              <div className="cart-management" style={{ gap: '10px', display: 'flex', flexDirection: 'column', marginBottom: '20px', marginTop: '15px' }}>
                <h2 style={{ color: '#2ecc71', margin: 0, fontSize: '2rem' }}>₹{price.toLocaleString('en-IN')} <span style={{ fontSize: '1rem', color: '#777' }}>/ Box</span></h2>
                
                {cartItem ? (
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
                      <button style={{ padding: '8px 18px', border: 'none', background: '#f8f9fa', cursor: 'pointer', fontSize: '1.4rem', borderRight: '1px solid #ccc' }} onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span style={{ padding: '0 20px', fontSize: '1.2rem', fontWeight: 'bold' }}>{cartItem.quantity}</span>
                      <button style={{ padding: '8px 18px', border: 'none', background: '#f8f9fa', cursor: 'pointer', fontSize: '1.4rem', borderLeft: '1px solid #ccc' }} onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                    <button className="btn-request-call" style={{ margin: 0, padding: '12px 25px', background: '#3498db', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }} onClick={() => navigate('/cart')}>
                      Go to Cart
                    </button>
                  </div>
                ) : (
                  <button className="btn-request-call" style={{ margin: '10px 0 0 0', background: '#e67e22', maxWidth: 'max-content', padding: '12px 35px', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }} onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                )}
              </div>
              
              <div className="price-placeholder" style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <h3>Wholesale Price Available</h3>
              <p>Contact us for bulk pricing and catalogs.</p>
            </div>

            <div className="product-specs">
              <h3>Product Details</h3>
              <ul>
                <li><strong>Fabric:</strong> Premium {category} Material</li>
                <li><strong>Pattern:</strong> As per image / Catalog designs</li>
                <li><strong>Work:</strong> Embroidery / Print / Handwork</li>
                <li><strong>Occasion:</strong> Casual, Party, Festive Wear</li>
                <li><strong>MOQ (Minimum Order Qty):</strong> 1 Set (Wholesale Only)</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button className="btn-request-call" onClick={handleRequestCall}>
                Request Call Back
              </button>
              <button className="btn-whatsapp" onClick={() => window.open(`https://wa.me/something?text=I am interested in ${productName}`, '_blank')}>
                Enquire on WhatsApp
              </button>
            </div>

            <div className="extra-info">
              <div className="info-item">
                <span className="icon">🚚</span> Worldwide Shipping Available
              </div>
              <div className="info-item">
                <span className="icon">💯</span> 100% Quality Assurance
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="section-title">Products Related to {productName}</h2>
            <div className="related-scrolling-wrapper">
              {relatedProducts.map(rel => (
                <Link to={`/product/${encodeURIComponent(category)}/${encodeURIComponent(rel.name)}`} key={rel.name} className="rel-product-card">
                  <div className="rel-img-container">
                    <img 
                      src={`/images/products/${encodeURIComponent(category)}/${encodeURIComponent(rel.file)}`} 
                      alt={rel.name} 
                      loading="lazy"
                    />
                  </div>
                  <div className="rel-info">
                    <div className="rel-name">{rel.name}</div>
                    <div className="rel-link">View Details</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SEO Category Description Section */}
        <div className="seo-description-section">
          <h2>Buy Premium {category} in Bulk Online</h2>
          <p>
            Welcome to the ultimate destination for sourcing high-quality <strong>{category}</strong>. 
            At Mahavir Creation, we specialize in manufacturing and supplying a wide array of exquisite {category.toLowerCase()}s 
            designed to meet the demands of modern retailers, boutique owners, and wholesalers across the globe. 
          </p>
          <p>
            Our collection of {productName} showcases meticulous craftsmanship, vibrant color palettes, and premium fabric choices 
            that guarantee customer satisfaction. When you buy {category.toLowerCase()}s in bulk from us, you benefit from competitive 
            wholesale pricing, ensuring excellent profit margins for your business without compromising on quality or style.
          </p>
          <p>
            Explore our extensive catalog covering everyday wear to heavy bridal and party wear sets. 
            Each piece is crafted with trendsetting patterns and timeless aesthetics in mind. Partner with us today and elevate 
            your store's inventory with the finest {category.toLowerCase()}s sourced directly from Surat's leading manufacturers.
          </p>
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
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{modalType === 'login' ? '🔒' : '⚠️'}</div>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>
                {modalType === 'login' ? 'Login Required' : 'Customer Account Required'}
              </h2>
              <p style={{ color: '#666', marginBottom: '25px', fontSize: '1.05rem', lineHeight: '1.5' }}>
                {modalType === 'login' 
                  ? 'You need to log in or create a customer account to start adding gorgeous items to your cart!' 
                  : 'Your current account type cannot buy products. Please log out and register as a "Product Buy" user to shop!'}
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  style={{ padding: '10px 20px', border: '1px solid #ccc', background: 'transparent', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancel
                </button>
                {modalType === 'login' ? (
                  <>
                    <button 
                      onClick={() => navigate('/login')}
                      style={{ padding: '10px 25px', border: 'none', background: '#3498db', color: 'white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Go to Login
                    </button>
                    <button 
                      onClick={() => navigate('/register?role=ProductBuy')}
                      style={{ padding: '10px 25px', border: 'none', background: '#e67e22', color: 'white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Register to Buy
                    </button>
                  </>
                ) : (
                  <button 
                  onClick={() => {
                    localStorage.removeItem('userInfo');
                    navigate('/register?role=ProductBuy');
                  }}
                  style={{ padding: '10px 25px', border: 'none', background: '#e67e22', color: 'white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Logout & Register as Buyer
                </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;

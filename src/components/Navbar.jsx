import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search as SearchIcon } from 'lucide-react';
import '../pages/Search.css';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { getCartCount } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMenuOpen(false);
      navigate('/search?keyword=' + encodeURIComponent(searchQuery));
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    closeMenu();
  };

  const getDashboardLink = () => {
    if (!userInfo) return '/login';
    const role = userInfo.role;
    if (role === 'Admin') return '/admin_dashboard';
    if (role === 'Merchant') return '/merchant_dashboard';
    if (role === 'Worker') return '/dashboard';
    if (role === 'Product Buy') return '/profile';
    return '/home';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div className="navbar-logo">MC</div>
            <div className="navbar-title">Mahavir Creation</div>
          </Link>
        </div>

        {/* Mobile Toggle Icons */}
        <div className="mobile-only-flex" style={{ display: 'none', gap: '15px', alignItems: 'center' }}>
          <div className="nav-search-mobile" onClick={() => setIsSearchOpen(true)}><SearchIcon size={20} /></div>
          <Link to="/cart" onClick={closeMenu} style={{ position: 'relative', color: 'white' }}>
            <ShoppingCart size={20} />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
          <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`navbar-right ${isMenuOpen ? 'mobile-show' : ''}`}>
          <Link to="/products" onClick={closeMenu} className={`nav-link-plain${currentPath === '/products' ? ' nav-link-active' : ''}`}>Our Products</Link>
          <Link to="/about" onClick={closeMenu} className={`nav-link-plain${currentPath === '/about' ? ' nav-link-active' : ''}`}>About Us</Link>
          <Link to="/contact" onClick={closeMenu} className={`nav-link-plain${currentPath === '/contact' ? ' nav-link-active' : ''}`}>Contact Us</Link>
          
          <div className="desktop-only-flex" style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/cart" onClick={closeMenu} className="nav-cart-icon" style={{ position: 'relative', textDecoration: 'none', marginLeft: '10px', marginRight: '10px', color: '#fff' }}>
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>

            {userInfo ? (
              <>
                <Link to={getDashboardLink()} onClick={closeMenu} style={{ border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '5px 15px', fontSize: '13px' }}>
                  {userInfo.role === 'Product Buy' ? 'My Profile' : 'Dashboard'}
                </Link>
                <button 
                  onClick={logout}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer', marginLeft: '10px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>Login</Link>
                <Link to="/register" onClick={closeMenu}>Register</Link>
              </>
            )}
            <div className="nav-search" onClick={() => setIsSearchOpen(true)} style={{ marginLeft: '10px' }}><SearchIcon size={18} /></div>
          </div>

          <div className="mobile-only-block" style={{ display: 'none', marginTop: '20px' }}>
            {userInfo ? (
               <>
                <Link to={getDashboardLink()} onClick={closeMenu} className="mobile-nav-btn">
                  {userInfo.role === 'Product Buy' ? 'My Profile' : 'Dashboard'}
                </Link>
                <button onClick={logout} className="mobile-nav-btn" style={{ width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.1)' }}>Logout</button>
               </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="mobile-nav-btn">Login</Link>
                <Link to="/register" onClick={closeMenu} className="mobile-nav-btn">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="nav-search-modal">
          <button className="search-modal-close" onClick={() => setIsSearchOpen(false)}><X size={40} strokeWidth={1} /></button>
          <div className="search-modal-content">
            <form onSubmit={handleSearchSubmit} className="search-modal-input-group">
              <input 
                type="text" 
                placeholder="Search for Sarees, Lehengas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-modal-submit"><SearchIcon size={30} /></button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">MC</div>
          <p>
            Welcome to Mahavir Creation, your trusted destination for designer ethnic wear from Surat.
            From sarees and lehengas to everyday kurtis and bottom wear, our collections are crafted to
            bring you the best blend of fashion, comfort and value.
          </p>
          <Link to="/about">
            <button className="button-primary" type="button">Know More</button>
          </Link>
        </div>

        <div className="footer-products">
          <div className="footer-title">Our Products</div>
          <ul className="footer-list">
            <li><Link to="/products?category=Saree">Saree</Link></li>
            <li><Link to="/products?category=Lehenga">Lehenga</Link></li>
            <li><Link to="/products?category=Suit">Suit</Link></li>
            <li><Link to="/products?category=Kurti">Kurti</Link></li>
            <li><Link to="/products?category=Dupatta">Dupatta</Link></li>
            <li><Link to="/products?category=Blouse">Blouse</Link></li>
            <li><Link to="/products?category=Petticoat">Petticoat</Link></li>
            <li><Link to="/products?category=Women%20Bottom%20Wear">Women Bottom Wear</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <div className="footer-title">Quick Links</div>
          <ul className="footer-list">
            <li><Link to="/about">About Us</Link></li>
            <li><a href="#">Mahavir Franchise</a></li>
            <li><a href="#">Blogs</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms and Conditions</a></li>
            <li><a href="#">Refund &amp; Exchange Policy</a></li>
            <li><a href="#">Sitemap</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <div className="footer-title">Contact Info</div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">📞</div>
            <div>Phone: 9586780968</div>
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">@</div>
            <div>Email: Mahavircre333@gmail.com</div>
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">📍</div>
            <div>
              Address: 333 to 350, BHAGYODAY INDUSTRIAL ESTATE, Aai Mata Rd, behind RAGUVEER MARKET,<br/>
              Surat, Gujarat 395010<br/>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Mahavir Creation. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;

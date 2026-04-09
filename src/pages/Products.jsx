import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Products.css';
import productMap from '../data/productMap.json';

const Products = () => {
  return (
    <div className="products-page">
      <Navbar />

      {Object.keys(productMap).map((category) => (
        <div key={category} className="category-section">
          <h2 className="category-title">Range Of {category}</h2>
          <p className="category-subtitle">
            Experience effortless style and comfort with Mahavir Creation's diverse range of {category}. Explore vibrant colors, intricate designs, and premium fabrics.
          </p>

          <div className="scrolling-wrapper">
            {productMap[category].map((subItem) => (
              <Link to={`/product/${encodeURIComponent(category)}/${encodeURIComponent(subItem.name)}`} key={subItem.name} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-image-container">
                  <img 
                    src={`/images/products/${encodeURIComponent(category)}/${encodeURIComponent(subItem.file)}`} 
                    alt={subItem.name} 
                    className="product-image" 
                    loading="lazy"
                  />
                </div>
                <div className="product-info">
                  <div className="product-name">{subItem.name}</div>
                  <div className="product-link">See the collection</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <Footer />
    </div>
  );
};

export default Products;

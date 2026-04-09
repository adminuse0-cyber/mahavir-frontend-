import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InquiryModal from '../components/InquiryModal';
import productMap from '../data/productMap.json';
import './Products.css'; // Reuses base product card core styling
import './Search.css';

// Mocked realistic catalog pricing by category as requested for detailed product view
const MOCK_PRICES = {
  "Saree": "₹ 850 / Piece",
  "Lehenga": "₹ 3,500 / Piece",
  "Suit": "₹ 1,200 / Piece",
  "Kurti": "₹ 550 / Piece",
  "Dupatta": "₹ 250 / Piece",
  "Blouse": "₹ 400 / Piece",
  "Petticoat": "₹ 150 / Piece",
  "Women Bottom Wear": "₹ 600 / Piece"
};

const getPriceForCategory = (category) => {
  return MOCK_PRICES[category] || "₹ 450 / Piece";
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = (searchParams.get('keyword') || '').toLowerCase();

  const [results, setResults] = useState([]);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  useEffect(() => {
    // Build flat array of all products
    const allProducts = [];
    Object.keys(productMap).forEach((category) => {
      productMap[category].forEach((subItem) => {
        allProducts.push({
          category: category,
          name: subItem.name,
          file: subItem.file,
          price: getPriceForCategory(category)
        });
      });
    });

    if (keyword.trim() === '') {
      setResults(allProducts);
      return;
    }

    // Filter by keyword checking both product name or category strictly
    const filtered = allProducts.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.category.toLowerCase().includes(keyword)
    );
    setResults(filtered);

  }, [keyword]);

  return (
    <div className="search-page">
      <Navbar />

      <div className="search-results-container">
        <div className="search-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', textAlign: 'left' }}>
          <div>
            <h2>Search Results for: <span>"{keyword}"</span></h2>
            <p>Found {results.length} products matching your query.</p>
          </div>
          <button className="button-secondary" onClick={() => navigate('/products')}>Back to Products</button>
        </div>

        {results.length > 0 ? (
          <div className="search-grid">
            {results.map((item, idx) => (
              <div key={idx} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={`/images/products/${encodeURIComponent(item.category)}/${encodeURIComponent(item.file)}`} 
                    alt={item.name} 
                    className="product-image" 
                    loading="lazy"
                  />
                </div>
                <div className="product-info search-product-info">
                  <div className="product-category-badge">{item.category}</div>
                  <div className="product-name">{item.name}</div>
                  <div className="product-price">{item.price}</div>
                  <button className="inquire-btn" onClick={() => setInquiryProduct(item)}>Request Callback</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search keyword and try again.</p>
          </div>
        )}
      </div>

      <InquiryModal 
        isOpen={!!inquiryProduct} 
        product={inquiryProduct} 
        onClose={() => setInquiryProduct(null)} 
      />
      <Footer />
    </div>
  );
};

export default Search;

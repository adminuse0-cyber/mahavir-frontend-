import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollingText from '../components/ScrollingText';

const navProducts = {
  "Saree": ["Dyed Fancy Matching Saree", "Cotton Sarees", "Rapier Silk Sarees", "Printed Sarees", "Paithani Sarees", "Dyed Matching Sarees", "Uniform Sarees"],
  "Lehenga": ["Surat Lehenga", "Designer Lehenga", "Indo Western Lehenga", "Party Wear Lehenga", "Wedding Lehenga", "Bridal Lehenga"],
  "Suit": ["Ladies Designer Suits", "Ladies Printed Suits", "Embroidered Ladies Suit", "Pakistani Suits", "Jaipuri Suit", "Punjabi Suits", "Salwar Suit"],
  "Kurti": ["Surat Kurti", "Surat Kurta", "Nayra Cut Kurti", "Ladies Kurti", "Half Sleeve Kurtis", "Long Kurti", "Lucknowi Kurtis", "Handloom Cotton Kurti"],
  "Dupatta": ["Cotton Dupatta", "Chiffon Dupatta", "Silk Dupatta", "Net Dupatta", "Velvet Dupatta", "Georgette Dupatta", "Rayon Dupatta", "Satin Dupatta", "Linen Dupatta", "Printed Dupatta", "Plain Dupatta", "Embroidery Dupatta"],
  "Blouse": ["Designer Blouse", "Ready Made Blouse", "Stretchable Blouse", "Blouse Pcs"],
  "Petticoat": ["Saree Shapewear Petticoat", "Stitch Petticoat", "Poplin Petticoat", "Poplin Than Petticoat"],
  "Women Bottom Wear": ["Women Pajama", "Women Shorts", "Women Pants", "Women Bottom Jeans", "Women Bell Bottom Jeans", "Women Leggings", "Women Jeggings", "Women Palazzo Pants"]
};

const slidesData = [
  { img: '/images/1.jpg.jpeg', title: 'Timeless Ethnic Elegance', desc: 'Discover premium sarees, lehengas, suits and more crafted in Surat with a blend of tradition and modern silhouettes.' },
  { img: '/images/3.jpg.jpeg', title: 'Designer Lehengas & Suits', desc: 'Statement pieces with intricate detailing, perfect for weddings, receptions and festive occasions.' },
  { img: '/images/4.jpg.jpeg', title: 'Crafted in Surat', desc: 'From fabric sourcing to final finishing, every piece reflects Mahavir Creation’s commitment to premium quality.' },
  { img: '/images/2.jpg.jpeg', title: 'Everyday Kurti Classics', desc: 'Comfortable, versatile kurtis and bottom wear designed for effortless everyday elegance.' }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleCategory = (cat, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenCategory(openCategory === cat ? null : cat);
  };

  useEffect(() => {
    const closeMenu = () => setOpenCategory(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  return (
    <>
      <div className="top-info-bar">
        <ScrollingText>Come, join hands with Mahavir Creation from Surat – premium ethnic wear with pan‑India and worldwide supply.</ScrollingText>
      </div>

      <Navbar />

      <div className="category-bar">
        {Object.entries(navProducts).map(([cat, subs]) => (
          <div key={cat} className={`category-item category-has-sub ${openCategory === cat ? 'open' : ''}`}>
            <div className="category-pill" onClick={(e) => toggleCategory(cat, e)}>
              {cat}
            </div>
            <ul className="sub-menu">
              {subs.map(sub => (
                <li key={sub}>
                  <Link to={`/product/${encodeURIComponent(cat)}/${encodeURIComponent(sub)}`}>
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="main-container">
        <div className="hero-slider" id="heroSlider">
          {slidesData.map((slide, idx) => (
            <div key={idx} className={`hero-slide ${idx === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url('${slide.img}')` }}>
              <div className="hero-overlay">
                <div className="hero-text">
                  <h1>{slide.title}</h1>
                  <p>{slide.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <h2>Why Choose Mahavir Creation?</h2>
          <p>
            Mahavir Creation stands out with trendsetting designs, premium quality fabrics, and unparalleled craftsmanship.
            Elevate your style with us – where fashion meets sophistication and innovation. From elegant sarees and bridal
            lehengas to versatile kurtis, dupattas, blouses, petticoats and women bottom wear, we bring you collections
            that are thoughtfully designed for modern women across India and worldwide.
          </p>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon">30+</div>
              <div>
                <div className="stat-text-title">Years of Expertise</div>
                <div className="stat-text-desc">Strong experience in textiles and ethnic fashion manufacturing from Surat.</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">50K</div>
              <div>
                <div className="stat-text-title">Retailers &amp; Merchants</div>
                <div className="stat-text-desc">Trusted partners across India who source sarees, lehengas and kurtis from us.</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">30+</div>
              <div>
                <div className="stat-text-title">Countries Served</div>
                <div className="stat-text-desc">Serving fashion entrepreneurs worldwide with consistent quality.</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">10L</div>
              <div>
                <div className="stat-text-title">Pieces / Month</div>
                <div className="stat-text-desc">Robust production capacity to fulfil bulk and export orders on time.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="process-strip">
          <h3>Quality Control</h3>
          <p>Quality control is our priority. With rigorous standards and meticulous attention to detail, we ensure each garment meets the highest standards of craftsmanship and customer satisfaction.</p>
          <div className="process-items">
            {['Color Bleeding Test', 'Fusing Test', 'Dispatching Check', 'Finishing Test', 'Shrinkage Test'].map(step => (
              <div key={step} className="process-item">
                <div className="process-badge"><span>{step}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="process-strip">
          <h3>Production Strength</h3>
          <p>Our production strength lies in precision, innovation and efficiency. We deliver top‑notch quality at scale, meeting demands with excellence and exceeding expectations.</p>
          <div className="process-items process-circle">
            {['Pre Production', 'Cutting', 'Sewing', 'Checking', 'Ironing', 'Packing', 'Delivery'].map(step => (
              <div key={step} className="process-item">
                <div className="process-badge"><span dangerouslySetInnerHTML={{ __html: step.replace(' ', '<br>') }}></span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Welcome to Mahavir Creation</h2>
          <p>
            At Mahavir Creation, we welcome you to a world of refined ethnic fashion curated from the heart of Surat.
            Our in–house team focuses on detail, fit and finishing so that every outfit feels luxurious yet comfortable.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;

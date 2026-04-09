import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Animated Counter Component
const Counter = ({ from, to, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const About = () => {
  return (
    <>
      <Navbar />

      {/* Hero Banner with Zoom Effect */}
      <div className="about-hero">
        <div className="about-hero-bg" style={{ backgroundImage: "url('/images/5.jpg')" }}></div>
        <div className="about-hero-overlay" style={{ background: 'rgba(0,0,0,0.1)' }}>
        </div>
      </div>

      <div className="main-container about-page-container">

        {/* Standalone Intro Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          style={{ textAlign: 'center', paddingBottom: '40px', borderBottom: '1px solid #eee', marginBottom: '40px' }}
        >
          <h1 style={{ color: '#b71c1c', fontSize: '38px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
            Defining Ethnic Elegance
          </h1>
          <p style={{ fontSize: '18px', color: '#555', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            A journey from a small weaving unit in Surat to a global powerhouse of ethnic wear.
          </p>
        </motion.div>

        {/* Our Story Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="about-section story-section"
          style={{ overflow: 'hidden' }}
        >
          <motion.div variants={slideInLeft} className="story-content">
            <h2 className="section-title">Our Story</h2>
            <p>
              Established in the textile hub of Surat, <strong>Mahavir Creation</strong> has grown into a premier manufacturer, supplier, and exporter of high-quality women's ethnic wear. What started as a humble endeavor decades ago is now an industry standard for premium ethnic fashion.
            </p>
            <p>
              We pride ourselves on our deep-rooted Indian heritage blended with modern manufacturing techniques. Every saree, lehenga, and kurti is a testament to the skill of our artisans and the vision of our founders.
            </p>
          </motion.div>
          <motion.div variants={slideInRight} className="story-image">
            <img src="/images/7.jpg" alt="Our Manufacturing" />
          </motion.div>
        </motion.div>

        {/* Milestones / Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="about-stats-container"
        >
          <motion.div variants={fadeUp} className="about-stat-card">
            <h3><Counter from={0} to={30} suffix="+" /></h3>
            <p>Years of Legacy</p>
          </motion.div>
          <motion.div variants={fadeUp} className="about-stat-card">
            <h3><Counter from={0} to={50} suffix="K+" /></h3>
            <p>Happy Retailers</p>
          </motion.div>
          <motion.div variants={fadeUp} className="about-stat-card">
            <h3><Counter from={0} to={30} suffix="+" /></h3>
            <p>Export Countries</p>
          </motion.div>
          <motion.div variants={fadeUp} className="about-stat-card">
            <h3><Counter from={0} to={10} suffix="L+" /></h3>
            <p>Garments / Month</p>
          </motion.div>
        </motion.div>

        {/* Core Pillars Section */}
        <div className="about-section pillars-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center"
          >
            <h2 className="section-title center">Our Core Pillars</h2>
            <p className="section-subtitle">The foundation that makes Mahavir Creation a trusted name worldwide.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="pillars-grid"
          >
            {[
              { title: "Premium Quality", desc: "Sourcing the best yarns and employing strict quality controls at every production step." },
              { title: "Innovative Design", desc: "Our in-house design team brings fresh, trend-setting patterns blending tradition with modern aesthetics." },
              { title: "Trust & Transparency", desc: "Building long-term relationships with our wholesale and retail partners through ethical business practices." },
            ].map((pillar, i) => (
              <motion.div key={i} variants={fadeUp} className="pillar-card">
                <div className="pillar-icon">✧</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Manufacturing Excellence */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="about-section"
        >
          <div className="manufacturing-banner">
            <div className="manufacturing-content">
              <h2>State-of-the-Art Manufacturing</h2>
              <p>
                From spinning and weaving to printing, embroidery, and final dispatch, we own the entire supply chain.
                This allows us to guarantee unbeatable quality and highly competitive bulk pricing.
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </>
  );
};

export default About;

import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title left-align">ABOUT <span>US</span></h2>
            <h3 className="about-subtitle">Dental Clinic provides all forms of dentistry</h3>
            <p>
              We are a dedicated team of professionals who strive to deliver the best dental care. Our clinic is equipped with the latest technology, ensuring accurate diagnostics and comfortable treatments. We believe in building lasting relationships with our patients based on trust and transparency.
            </p>
            <button className="btn btn-primary btn-about">LEARN MORE</button>
            
            <div className="certifications">
              <h4>Our Certifications</h4>
              <div className="cert-badges">
                <div className="badge">CERTIFIED</div>
                <div className="badge">AWARD WINNER</div>
                <div className="badge">TOP RATED</div>
                <div className="badge">EXCELLENCE</div>
              </div>
            </div>
          </div>
          
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800" alt="Dental Chair Setup" />
            <div className="image-caption">
              Our modern, state-of-the-art facility guarantees a comfortable experience.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

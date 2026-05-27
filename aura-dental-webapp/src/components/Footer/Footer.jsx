import React, { useState } from 'react';
import { Globe, Share2, Link, Users, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [expandedHours, setExpandedHours] = useState(false);
  
  const workingHours = [
    { day: 'Monday', hours: '9:30 AM – 2:30 PM / 5:00 PM – 9:00 PM' },
    { day: 'Tuesday', hours: '9:30 AM – 2:30 PM / 5:00 PM – 9:00 PM' },
    { day: 'Wednesday', hours: '9:30 AM – 2:30 PM / 5:00 PM – 9:00 PM', note: '(Eid al-Adha) Hours might differ' },
    { day: 'Thursday', hours: '9:30 AM – 2:30 PM / 5:00 PM – 9:00 PM' },
    { day: 'Friday', hours: '9:30 AM – 1:30 PM / 5:00 PM – 9:00 PM' },
    { day: 'Saturday', hours: '9:30 AM – 8:30 PM' },
    { day: 'Sunday', hours: '10:30 AM – 1:00 PM' },
  ];

  const getCurrentDayIndex = () => {
    return new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  };

  const currentDayIndex = getCurrentDayIndex();
  const currentDayHours = workingHours[currentDayIndex];

  return (
    <footer className="footer">
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h3>Subscribe to our Newsletter</h3>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-outline">SIGN UP</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="logo footer-logo">
                <img
                  src="https://i.postimg.cc/Vv28j7Xd/AIDEntal.jpg"
                  alt="AI Dental Logo"
                  className="footer-logo-image"
                />
              </div>
              <p>We provide all forms of dentistry to help you get your perfect smile.</p>
            </div>
            
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#team">Our Team</a></li>
                <li><a href="#news">Latest News</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <li><MapPin size={18} /> Ramakrishna Rd, opposite to Vijaya Hospital Petrol Pump, Seerangapalayam, Salem, Tamil Nadu 636007</li>
                <li><Phone size={18} /> <a href="tel:+917200077860">072000 77860</a></li>
                <li><Mail size={18} /> <a href="mailto:info@aimaxdental.com">info@aimaxdental.com</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <div className="hours-header">
                <h4>Working Hours</h4>
                <button 
                  className={`expand-btn ${expandedHours ? 'expanded' : ''}`}
                  onClick={() => setExpandedHours(!expandedHours)}
                  aria-label="Toggle working hours"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <ul className="working-hours">
                <li className="current-day">
                  <span className="day-highlight">{currentDayHours.day}</span>
                  <span className="hours-text">{currentDayHours.hours}</span>
                </li>
                {expandedHours && workingHours.map((item, idx) => 
                  idx !== currentDayIndex && (
                    <li key={item.day}>
                      <span>{item.day}</span>
                      <span className="hours-text">{item.hours} {item.note && <em>{item.note}</em>}</span>
                    </li>
                  )
                )}
              </ul>
              <div className="footer-social">
                <a href="#"><Globe size={18} /></a>
                <a href="#"><Share2 size={18} /></a>
                <a href="#"><Link size={18} /></a>
                <a href="#"><Users size={18} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Dental Clinic. All Rights Reserved. developed by <a href="https://www.datazync.com" target="_blank" rel="noreferrer" className="footer-link">www.datazync.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

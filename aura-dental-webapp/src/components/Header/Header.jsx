import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Stethoscope } from 'lucide-react';
import './Header.css';

const Header = ({ onBookAppointment, onDoctorLogin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <img
            src="/aidental-logo.jpg"
            alt="AI Dental Logo"
            className="logo-image"
          />
        </div>
        
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#team">Pages</a>
          <a href="#news">News</a>
        </nav>

        <div className="header-actions">
          <a href="tel:+123456789" className="action-btn">
            <Phone size={18} />
          </a>
          <a href="#contact" className="action-btn">
            <MessageCircle size={18} />
          </a>
          <button className="doctor-login-btn" onClick={onDoctorLogin}>
            <Stethoscope size={16} />
            Doctor Login
          </button>
          <button className="btn btn-primary btn-appointment" onClick={onBookAppointment}>MAKE AN APPOINTMENT</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

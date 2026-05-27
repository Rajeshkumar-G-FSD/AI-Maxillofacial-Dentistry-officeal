import React from 'react';
import { MessageSquareQuote } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="testimonials-bg">
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1920" alt="Clinic Background" />
        <div className="testimonials-overlay"></div>
      </div>
      
      <div className="container">
        <h2 className="section-title text-white">What Our <span>Patience</span> Says</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <MessageSquareQuote className="quote-icon" size={32} />
            <p>I have never felt more comfortable at a dentist's office. The staff is incredibly friendly and professional. Highly recommended for anyone with dental anxiety!</p>
            <h4>Amanda Adams</h4>
            <span className="role">Patient</span>
          </div>
          
          <div className="testimonial-card active">
            <MessageSquareQuote className="quote-icon" size={32} />
            <p>State-of-the-art facility with a team that truly cares about your dental health. I went in for a routine checkup and left with a comprehensive plan for my smile.</p>
            <h4>James Anderson</h4>
            <span className="role">Patient</span>
          </div>
          
          <div className="testimonial-card">
            <MessageSquareQuote className="quote-icon" size={32} />
            <p>Exceptional service from start to finish. The doctors explained every procedure clearly, and the results have exceeded my expectations.</p>
            <h4>Sarah Williams</h4>
            <span className="role">Patient</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

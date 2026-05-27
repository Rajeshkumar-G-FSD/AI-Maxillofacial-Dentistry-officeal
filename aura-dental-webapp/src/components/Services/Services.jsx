import React from 'react';
import { Smile, Sparkles, PlusSquare, Scissors, Activity, ActivitySquare, MessageCircle } from 'lucide-react';
import './Services.css';

const Services = () => {
  const servicesList = [
    { id: 1, title: 'Teeth Whitening', icon: <Sparkles size={40} />, image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Bonding & Veneers', icon: <Smile size={40} />, image: 'https://images.unsplash.com/photo-1564739481415-4c93f3f6959c?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Check-ups & Preventive Care', icon: <Activity size={40} />, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400' },
    { id: 4, title: 'Cosmetic Dentistry', icon: <Sparkles size={40} />, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400' },
    { id: 5, title: 'Dental Implants', icon: <PlusSquare size={40} />, image: 'https://images.unsplash.com/photo-1628177142898-93e46e465a34?auto=format&fit=crop&q=80&w=400' },
    { id: 6, title: 'Dentures & Bridges', icon: <ActivitySquare size={40} />, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400' },
    { id: 7, title: 'Emergency Dental Care', icon: <MessageCircle size={40} />, image: 'https://images.unsplash.com/photo-1515091631217-019d7401a6b2?auto=format&fit=crop&q=80&w=400' },
    { id: 8, title: 'Extractions & Surgery', icon: <Scissors size={40} />, image: 'https://images.unsplash.com/photo-1598256989800-fea5f61706bd?auto=format&fit=crop&q=80&w=400' },
    { id: 9, title: 'Fillings & Sealants', icon: <ActivitySquare size={40} />, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400' },
    { id: 10, title: 'Laser Dentistry', icon: <Sparkles size={40} />, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400' },
    { id: 11, title: 'Invisalign & Clear Aligners', icon: <Smile size={40} />, image: 'https://images.unsplash.com/photo-1594824436951-7f12bc90f5e1?auto=format&fit=crop&q=80&w=400' },
    { id: 12, title: 'Root Canal Treatment', icon: <Activity size={40} />, image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=400' },
  ];

  const serviceKeywordText = `Teeth whitening, Bonding, Check-ups, Cosmetic procedures, Dental implants, Dentures & bridges, Emergency care, Extractions, Fillings and sealants, Laser dentistry, Mouth guards, Online dentist booking, Oral surgery, Paediatrics, Root canals, Teeth cleaning, Teeth reshaping, Invisalign near me Salem, Clear aligners near Salem junction, Dentist for aligners in Salem town, Invisalign clinic Ramakrishna Road Salem, Dentist in Salem, Dental clinic in Salem, Best dentist in Salem, Dental hospital Salem Tamil Nadu, Dental implants in Salem, Full mouth implants Salem, Immediate dental implants Salem, Teeth replacement Salem, Invisalign in Salem, Invisible aligners Salem, Invisible braces Salem, Smile designing Salem, Root canal treatment Salem, Painless RCT Salem, Teeth cleaning Salem, Tooth extraction Salem, Invisalign dentist in Salem, Clear aligners in Salem, Best Invisalign provider Salem, Invisalign treatment Salem Tamil Nadu, Invisalign cost in Salem, Clear aligners price Salem, Affordable Invisalign Salem, EMI for Invisalign Salem, Best price Invisalign Salem, Certified Invisalign provider Salem, Experienced Invisalign dentist Salem, Smile correction specialist Salem, Cosmetic dentist Salem aligners, Digital smile design Salem, Fix crooked teeth without braces Salem, Teeth gap correction Salem aligners, Smile correction without metal braces, Align teeth without brackets Salem, Adult invisible braces Salem, Bone grafting, Bone regeneration, CO2 laser treatment, Cosmetic periodontal surgery, Crown lengthening, Digital radiography, General consultation, Gum grafting, Non-surgical periodontal therapy, Osseous surgery, Periodontal pocket reduction, Preventive care, Ridge preservation, Scaling & root planing, dentist near me, best dentist in Salem, dental clinic near me, dental clinic in Salem, teeth doctor near me, Invisalign near me, clear aligners near me, invisible braces near me, teeth straightening near me, braces treatment near me, aligners treatment in Salem, dental implants near me, tooth implant near me, full mouth dental implants in Salem, immediate dental implants near me, implant dentist in Salem, root canal treatment near me, painless root canal in Salem, tooth pain treatment near me, cavity treatment near me, teeth cleaning near me, smile designing near me, cosmetic dentist in Salem, teeth whitening near me, smile makeover in Salem, best dental clinic near me open now, affordable dentist near me, top rated dentist in Salem, nearby dental hospital and emergency dentist near me.`;

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <h2 className="section-title">WE ARE <span>SPECIALIZED</span> IN</h2>
        <p className="section-subtitle">We provide a wide range of dental services. We take pride in delivering the highest quality treatment.</p>
        
        <div className="services-grid">
          {servicesList.map(service => (
            <div className="service-card" key={service.id}>
              <div className="service-image">
                <img src={service.image} alt={service.title} />
                <div className="service-overlay">
                  {service.icon}
                  <h3>{service.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="services-summary">
          <p>{serviceKeywordText}</p>
        </div>
        <div className="services-action">
          <button className="btn btn-primary">BOOK AN APPOINTMENT <span>→</span></button>
        </div>
      </div>
    </section>
  );
};

export default Services;

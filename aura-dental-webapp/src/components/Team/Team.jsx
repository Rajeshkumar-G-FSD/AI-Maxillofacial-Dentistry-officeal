import React from 'react';
import { Globe, Share2, Users } from 'lucide-react';
import './Team.css';

const Team = () => {
  const teamMembers = [
    { id: 1, name: 'Dr. John Doe', role: 'Dentist', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Dr. Jane Smith', role: 'Orthodontist', image: 'https://images.unsplash.com/photo-1594824436951-7f12bc90f5e1?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Dr. Emily Chen', role: 'Surgeon', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' },
    { id: 4, name: 'Dr. Michael Lee', role: 'Hygienist', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300' },
  ];

  return (
    <section id="team" className="section team-section">
      <div className="container">
        <h2 className="section-title">MEET OUR <span>STAFF</span></h2>
        
        <div className="team-grid">
          {teamMembers.map(member => (
            <div className="team-card" key={member.id}>
              <div className="team-image">
                <img src={member.image} alt={member.name} />
                <div className="team-social">
                  <a href="#"><Globe size={18} /></a>
                  <a href="#"><Share2 size={18} /></a>
                  <a href="#"><Users size={18} /></a>
                </div>
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <button className="btn-profile">VIEW PROFILE</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="team-action">
          <button className="btn btn-primary">SEE ALL STAFF</button>
        </div>
      </div>
    </section>
  );
};

export default Team;

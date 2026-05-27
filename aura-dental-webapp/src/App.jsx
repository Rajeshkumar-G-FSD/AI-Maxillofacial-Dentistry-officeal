import { useState } from 'react';
import Header from './components/Header/Header';
import HeroScrollytelling from './components/Hero/HeroScrollytelling';
import Services from './components/Services/Services';
import About from './components/About/About';
import Team from './components/Team/Team';
import Testimonials from './components/Testimonials/Testimonials';
import News from './components/News/News';
import Footer from './components/Footer/Footer';
import AppointmentForm from './components/AppointmentForm/AppointmentForm';
import DoctorPortal from './components/DoctorPortal/DoctorPortal';
import AIChatbot from './components/AIChatbot/AIChatbot';

function App() {
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [isDoctorPortalOpen, setIsDoctorPortalOpen] = useState(false);

  return (
    <div className="app">
      <Header 
        onBookAppointment={() => setIsAppointmentFormOpen(true)}
        onDoctorLogin={() => setIsDoctorPortalOpen(true)}
      />
      <AppointmentForm 
        isOpen={isAppointmentFormOpen} 
        onClose={() => setIsAppointmentFormOpen(false)} 
      />
      <DoctorPortal
        isOpen={isDoctorPortalOpen}
        onClose={() => setIsDoctorPortalOpen(false)}
      />
      <AIChatbot />
      <main>
        <HeroScrollytelling />
        <Services />
        <About />
        <Team />
        <Testimonials />
        <News />
      </main>
      <Footer />
    </div>
  );
}

export default App;

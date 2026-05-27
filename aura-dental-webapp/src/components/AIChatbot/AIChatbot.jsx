import { useMemo, useState } from 'react';
import { Bot, Calendar, CheckCircle, Clock, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './AIChatbot.css';

const appointmentTypes = [
  'Exam & Cleaning',
  'Consultation',
  'Checkup',
  'Treatment',
  'Urgent Dental Care',
  'Others',
];

const services = [
  'Dental Implants',
  'Whitening / Bleaching',
  'Root Canal Treatment',
  'Orthodontics / Braces',
  'Periodontitis / Gum Treatment',
  'Lasers In Dentistry',
  'Preventive-Dentistry',
  'Fillings',
  'Inlays / Onlays',
  'Veneers',
  'Oral / Maxillo Facial Surgery',
  'Dentures',
  'Ceramic Crown / Bridges',
  'Pediatric',
  'Cosmetic / Esthetic',
  'Crown And Bridge',
  'Tooth Removal',
  'Smile Design',
  'Guided Surgery',
  'Full Mouth Rehabilitation',
];

const initialForm = {
  name: '',
  phone: '',
  appointmentType: '',
  service: '',
  appointmentDate: '',
  timeSlot: '',
  comments: '',
};

const generateTimeSlots = (date) => {
  if (!date) {
    return [];
  }

  const slots = [];
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  const isToday = selectedDate.getTime() === today.getTime();
  const startHour = isToday ? Math.ceil(new Date().getHours() + 1) : 9;

  for (let hour = startHour; hour <= 18; hour += 1) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return slots;
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const minDate = new Date().toISOString().split('T')[0];
  const timeSlots = useMemo(() => generateTimeSlots(formData.appointmentDate), [formData.appointmentDate]);

  const completionCount = [
    formData.name,
    formData.phone,
    formData.appointmentType,
    formData.service,
    formData.appointmentDate,
    formData.timeSlot,
  ].filter(Boolean).length;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'appointmentDate' ? { timeSlot: '' } : {}),
    }));
    setError('');
    setIsSubmitted(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter patient name.';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) return 'Please enter a valid 10 digit phone number.';
    if (!formData.appointmentType) return 'Please select appointment type.';
    if (!formData.service) return 'Please select service.';
    if (!formData.appointmentDate) return 'Please select appointment date.';
    if (!formData.timeSlot) return 'Please select appointment slot.';
    return '';
  };

  const buildWhatsAppMessage = () => {
    return [
      '*AI Dental Quick Appointment*',
      '',
      `Patient: ${formData.name.trim()}`,
      `Phone: ${formData.phone.trim()}`,
      `Appointment Type: ${formData.appointmentType}`,
      `Service: ${formData.service}`,
      `Date: ${formData.appointmentDate}`,
      `Slot: ${formData.timeSlot}`,
      formData.comments.trim() ? `Issue / Notes: ${formData.comments.trim()}` : '',
      '',
      'Please confirm this appointment.',
    ].filter(Boolean).join('\n');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'appointments'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        secondaryPhone: '',
        appointmentType: formData.appointmentType,
        service: formData.service,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        comments: formData.comments.trim(),
        status: 'new',
        source: 'ai-chatbot',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      window.open(`https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage())}`, '_blank', 'noopener,noreferrer');
      setIsSubmitted(true);
      setFormData(initialForm);
    } catch (submitError) {
      console.error('Error saving chatbot appointment', submitError);
      setError('Unable to save appointment. Please check Firebase permissions and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ai-chatbot">
      {isOpen && (
        <section className="ai-chat-window" aria-label="AI quick appointment chatbot">
          <header className="ai-chat-header">
            <div className="ai-chat-title">
              <span className="ai-chat-avatar">
                <Bot size={24} />
              </span>
              <div>
                <p>AI Dental Assistant</p>
                <strong>Quick Appointment</strong>
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setIsOpen(false)} aria-label="Close AI chatbot">
              <X size={20} />
            </button>
          </header>

          <div className="ai-chat-body">
            <div className="ai-message bot-message">
              <Sparkles size={16} />
              <span>I can book your dental visit quickly. Fill the required fields and I will save it and prepare WhatsApp confirmation.</span>
            </div>

            <div className="ai-progress">
              <span>{completionCount}/6 required fields completed</span>
              <div>
                <i style={{ width: `${(completionCount / 6) * 100}%` }} />
              </div>
            </div>

            <form className="ai-appointment-form" onSubmit={handleSubmit}>
              <label>
                Patient Name *
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </label>

              <label>
                Phone Number *
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  required
                />
              </label>

              <label>
                Appointment Type *
                <select name="appointmentType" value={formData.appointmentType} onChange={handleChange} required>
                  <option value="">Select type</option>
                  {appointmentTypes.map((type) => (
                    <option value={type} key={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label>
                Service *
                <select name="service" value={formData.service} onChange={handleChange} required>
                  <option value="">Select service</option>
                  {services.map((service) => (
                    <option value={service} key={service}>{service}</option>
                  ))}
                </select>
              </label>

              <div className="ai-form-row">
                <label>
                  <span><Calendar size={15} /> Date *</span>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={minDate}
                    required
                  />
                </label>

                <label>
                  <span><Clock size={15} /> Slot *</span>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    disabled={!formData.appointmentDate}
                    required
                  >
                    <option value="">Select</option>
                    {timeSlots.map((slot) => (
                      <option value={slot} key={slot}>{slot}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Dental Issue / Notes
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Pain, swelling, cleaning, braces, implant..."
                  rows="3"
                />
              </label>

              {error && <div className="ai-chat-error">{error}</div>}
              {isSubmitted && (
                <div className="ai-chat-success">
                  <CheckCircle size={16} />
                  Appointment saved. WhatsApp confirmation opened.
                </div>
              )}

              <button className="ai-submit-btn" type="submit" disabled={isSubmitting}>
                <Send size={17} />
                {isSubmitting ? 'Saving...' : 'Submit & Send WhatsApp'}
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        className={`ai-chat-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI appointment chatbot"
      >
        <span className="ai-pulse-ring" />
        {isOpen ? <X size={26} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default AIChatbot;

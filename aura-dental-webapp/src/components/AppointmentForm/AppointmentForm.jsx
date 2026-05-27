import { useState } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './AppointmentForm.css';

const AppointmentForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    secondaryPhone: '',
    appointmentType: '',
    service: '',
    appointmentDate: '',
    timeSlot: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validatePhone = (value) => {
    if (!value.trim()) return 'Phone number is required';
    if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Phone must be 10 digits';
    if (value.length > 15) return 'Phone number is too long';
    return '';
  };

  const validateSecondaryPhone = (value) => {
    if (!value.trim()) return ''; // Optional field
    if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Secondary phone must be 10 digits';
    if (value.length > 15) return 'Phone number is too long';
    return '';
  };

  const validateAppointmentType = (value) => {
    if (!value) return 'Appointment type is required';
    return '';
  };

  const validateService = (value) => {
    if (!value) return 'Service is required';
    return '';
  };

  const validateDate = (value) => {
    if (!value) return 'Appointment date is required';
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return 'Please select a future date';
    return '';
  };

  const validateTimeSlot = (value) => {
    if (!value) return 'Time slot is required';
    return '';
  };

  const validateComments = (value) => {
    if (value.trim().length > 500) return 'Comments cannot exceed 500 characters';
    return '';
  };

  const validateAllFields = () => {
    const newErrors = {};
    newErrors.name = validateName(formData.name);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.secondaryPhone = validateSecondaryPhone(formData.secondaryPhone);
    newErrors.appointmentType = validateAppointmentType(formData.appointmentType);
    newErrors.service = validateService(formData.service);
    newErrors.appointmentDate = validateDate(formData.appointmentDate);
    newErrors.timeSlot = validateTimeSlot(formData.timeSlot);
    newErrors.comments = validateComments(formData.comments);
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const generateTimeSlots = (date) => {
    const slots = [];
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const isToday = selectedDate.getTime() === today.getTime();
    const startHour = isToday ? Math.ceil((new Date().getHours() + 1)) : 9;

    for (let i = startHour; i <= 18; i++) {
      const time = `${i.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      let error = '';
      switch(name) {
        case 'name':
          error = validateName(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        case 'secondaryPhone':
          error = validateSecondaryPhone(value);
          break;
        case 'appointmentType':
          error = validateAppointmentType(value);
          break;
        case 'service':
          error = validateService(value);
          break;
        case 'appointmentDate':
          error = validateDate(value);
          break;
        case 'timeSlot':
          error = validateTimeSlot(value);
          break;
        case 'comments':
          error = validateComments(value);
          break;
        default:
          break;
      }
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    let error = '';
    switch(name) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'secondaryPhone':
        error = validateSecondaryPhone(formData.secondaryPhone);
        break;
      case 'appointmentType':
        error = validateAppointmentType(formData.appointmentType);
        break;
      case 'service':
        error = validateService(formData.service);
        break;
      case 'appointmentDate':
        error = validateDate(formData.appointmentDate);
        break;
      case 'timeSlot':
        error = validateTimeSlot(formData.timeSlot);
        break;
      case 'comments':
        error = validateComments(formData.comments);
        break;
      default:
        break;
    }
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData(prev => ({
      ...prev,
      appointmentDate: date,
      timeSlot: '',
    }));
    
    if (touched.appointmentDate) {
      setErrors(prev => ({
        ...prev,
        appointmentDate: validateDate(date),
        timeSlot: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'appointments'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        secondaryPhone: formData.secondaryPhone.trim(),
        appointmentType: formData.appointmentType,
        service: formData.service,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        comments: formData.comments.trim(),
        status: 'new',
        source: 'website',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert('Appointment confirmed. We have received your request.');
      setFormData({
        name: '',
        phone: '',
        secondaryPhone: '',
        appointmentType: '',
        service: '',
        appointmentDate: '',
        timeSlot: '',
        comments: '',
      });
      setErrors({});
      setTouched({});
      onClose();
    } catch (err) {
      console.error('Error saving appointment', err);
      alert('There was an error submitting your appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const timeSlots = formData.appointmentDate ? generateTimeSlots(formData.appointmentDate) : [];
  
  const isFormValid = !Object.values(errors).some(error => error !== '') &&
                     formData.name && formData.phone && formData.appointmentType && 
                     formData.service && formData.appointmentDate && formData.timeSlot;

  const isFieldValid = (fieldName) => touched[fieldName] && !errors[fieldName];
  const isFieldInvalid = (fieldName) => touched[fieldName] && errors[fieldName];

  if (!isOpen) return null;

  return (
    <div className="appointment-modal-overlay" onClick={onClose}>
      <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book an Appointment</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <div className={`input-wrapper ${isFieldValid('name') ? 'valid' : isFieldInvalid('name') ? 'invalid' : ''}`}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your full name"
                required
              />
              {isFieldValid('name') && <CheckCircle size={18} className="icon-valid" />}
            </div>
            {isFieldInvalid('name') && <span className="error-message"><AlertCircle size={14} /> {errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className={`input-wrapper ${isFieldValid('phone') ? 'valid' : isFieldInvalid('phone') ? 'invalid' : ''}`}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10 digit number"
                  required
                />
                {isFieldValid('phone') && <CheckCircle size={18} className="icon-valid" />}
              </div>
              {isFieldInvalid('phone') && <span className="error-message"><AlertCircle size={14} /> {errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="secondaryPhone">Secondary Number (Optional)</label>
              <div className={`input-wrapper ${isFieldValid('secondaryPhone') ? 'valid' : isFieldInvalid('secondaryPhone') ? 'invalid' : ''}`}>
                <input
                  type="tel"
                  id="secondaryPhone"
                  name="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10 digit number"
                />
                {isFieldValid('secondaryPhone') && <CheckCircle size={18} className="icon-valid" />}
              </div>
              {isFieldInvalid('secondaryPhone') && <span className="error-message"><AlertCircle size={14} /> {errors.secondaryPhone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentType">Appointment Type *</label>
              <div className={`input-wrapper ${isFieldValid('appointmentType') ? 'valid' : isFieldInvalid('appointmentType') ? 'invalid' : ''}`}>
                <select
                  id="appointmentType"
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Select type</option>
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {isFieldValid('appointmentType') && <CheckCircle size={18} className="icon-valid" />}
              </div>
              {isFieldInvalid('appointmentType') && <span className="error-message"><AlertCircle size={14} /> {errors.appointmentType}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="service">Service *</label>
              <div className={`input-wrapper ${isFieldValid('service') ? 'valid' : isFieldInvalid('service') ? 'invalid' : ''}`}>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Select service</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                {isFieldValid('service') && <CheckCircle size={18} className="icon-valid" />}
              </div>
              {isFieldInvalid('service') && <span className="error-message"><AlertCircle size={14} /> {errors.service}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date *</label>
              <div className={`date-input-wrapper ${isFieldValid('appointmentDate') ? 'valid' : isFieldInvalid('appointmentDate') ? 'invalid' : ''}`}>
                <Calendar size={18} />
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleDateChange}
                  onBlur={handleBlur}
                  min={minDate}
                  required
                />
                {isFieldValid('appointmentDate') && <CheckCircle size={18} className="icon-valid" />}
              </div>
              {isFieldInvalid('appointmentDate') && <span className="error-message"><AlertCircle size={14} /> {errors.appointmentDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="timeSlot">Select Slot *</label>
              <div className={`time-input-wrapper ${isFieldValid('timeSlot') ? 'valid' : isFieldInvalid('timeSlot') ? 'invalid' : ''}`}>
                <Clock size={18} />
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={!formData.appointmentDate}
                >
                  <option value="">Select time</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {isFieldValid('timeSlot') && <CheckCircle size={18} className="icon-valid" />}
              </div>
              {isFieldInvalid('timeSlot') && <span className="error-message"><AlertCircle size={14} /> {errors.timeSlot}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comments">Comments / Issues</label>
            <div className={`input-wrapper ${isFieldValid('comments') ? 'valid' : isFieldInvalid('comments') ? 'invalid' : ''}`}>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your dental issues or any special requirements"
                rows="4"
              />
              {isFieldValid('comments') && <CheckCircle size={18} className="icon-valid icon-valid-textarea" />}
            </div>
            <div className="char-count">{formData.comments.length}/500</div>
            {isFieldInvalid('comments') && <span className="error-message"><AlertCircle size={14} /> {errors.comments}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;

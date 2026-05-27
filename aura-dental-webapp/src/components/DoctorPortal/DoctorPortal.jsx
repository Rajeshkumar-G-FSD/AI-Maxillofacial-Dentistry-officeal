import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Activity,
  CalendarDays,
  ClipboardList,
  Clock,
  CreditCard,
  Filter,
  FileText,
  Lock,
  LogOut,
  Pill,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  Timer,
  User,
  X,
} from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import './DoctorPortal.css';

const DoctorPortal = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [activePatientView, setActivePatientView] = useState('diagram');
  const [clinicUpiId, setClinicUpiId] = useState('aidentel@upi');
  const [carePanelStatus, setCarePanelStatus] = useState('Planned');
  const [filterDates, setFilterDates] = useState({ from: '', to: '' });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    const appointmentsQuery = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(items);
        setSelectedAppointmentId((currentId) => currentId || items[0]?.id || '');
        setIsLoading(false);
        setFetchError('');
      },
      (error) => {
        console.error('Error fetching appointments', error);
        setFetchError('Unable to load appointments right now.');
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [isAuthenticated, isOpen]);

  const filteredAppointments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return appointments;
    }

    return appointments.filter((appointment) => {
      const searchable = [
        appointment.name,
        appointment.phone,
        appointment.secondaryPhone,
        appointment.appointmentType,
        appointment.service,
        appointment.appointmentDate,
        appointment.timeSlot,
        appointment.comments,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesTerm = searchable.includes(term);
      const matchesFrom = !filterDates.from || appointment.appointmentDate >= filterDates.from;
      const matchesTo = !filterDates.to || appointment.appointmentDate <= filterDates.to;

      return matchesTerm && matchesFrom && matchesTo;
    });
  }, [appointments, filterDates, searchTerm]);

  const todayCount = appointments.filter((appointment) => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.appointmentDate === today;
  }).length;

  const nextAppointment = appointments
    .filter((appointment) => appointment.appointmentDate)
    .sort((a, b) => `${a.appointmentDate} ${a.timeSlot}`.localeCompare(`${b.appointmentDate} ${b.timeSlot}`))[0];

  const pendingCount = appointments.filter((appointment) => appointment.status !== 'completed').length;
  const outstandingDue = appointments.reduce((total, appointment) => {
    const appointmentText = `${appointment.service || ''} ${appointment.appointmentType || ''}`.toLowerCase();
    const estimate = appointmentText.includes('implant') || appointmentText.includes('surgery')
      ? 4500
      : appointmentText.includes('root') || appointmentText.includes('canal')
        ? 3500
        : 1200;
    return total + estimate;
  }, 0);

  const dashboardMetricCards = [
    {
      label: 'Total Appointments',
      value: appointments.length,
      badge: 'All',
      tone: 'purple',
      icon: CalendarDays,
    },
    {
      label: 'Pending Visits',
      value: pendingCount,
      badge: '0 Done',
      tone: 'orange',
      icon: Timer,
    },
    {
      label: 'Revenue Collected',
      value: '₹0',
      badge: 'Collected',
      tone: 'green',
      icon: ShieldCheck,
    },
    {
      label: 'Outstanding Due',
      value: `₹${outstandingDue.toLocaleString('en-IN')}`,
      badge: 'Unpaid',
      tone: 'red',
      icon: X,
    },
  ];

  const selectedAppointment = useMemo(() => {
    return appointments.find((appointment) => appointment.id === selectedAppointmentId) || appointments[0] || null;
  }, [appointments, selectedAppointmentId]);

  const selectedIssues = useMemo(() => {
    if (!selectedAppointment) {
      return [];
    }

    const issueText = `${selectedAppointment.service || ''} ${selectedAppointment.appointmentType || ''} ${selectedAppointment.comments || ''}`.toLowerCase();
    const issues = [];

    if (issueText.includes('root') || issueText.includes('canal') || issueText.includes('pulp')) {
      issues.push({ tooth: 36, label: 'Pulp involvement', condition: 'Root canal', treatment: 'RCT with crown', surface: 'Back', severity: 'critical', status: 'Planned', fee: 4500 });
      issues.push({ tooth: 46, label: 'Vitality check required', condition: 'Pulp sensitivity', treatment: 'X-ray and vitality test', surface: 'Top', severity: 'watch', status: 'Condition', fee: 900 });
    }

    if (issueText.includes('gum') || issueText.includes('periodont')) {
      issues.push({ tooth: 31, label: 'Gum inflammation', condition: 'Gingivitis', treatment: 'Scaling and polishing', surface: 'Front', severity: 'watch', status: 'Condition', fee: 1200 });
      issues.push({ tooth: 41, label: 'Pocket depth review', condition: 'Periodontal pocket', treatment: 'Perio charting', surface: 'Front', severity: 'watch', status: 'Condition', fee: 800 });
    }

    if (issueText.includes('implant') || issueText.includes('surgery')) {
      issues.push({ tooth: 26, label: 'Implant planning zone', condition: 'Missing tooth', treatment: 'Implant planning', surface: 'Back', severity: 'critical', status: 'Planned', fee: 25000 });
      issues.push({ tooth: 27, label: 'Bone density review', condition: 'Bone support', treatment: 'CBCT review', surface: 'Top', severity: 'watch', status: 'Condition', fee: 2500 });
    }

    if (issueText.includes('braces') || issueText.includes('orthodont')) {
      issues.push({ tooth: 13, label: 'Alignment assessment', condition: 'Malalignment', treatment: 'Orthodontic review', surface: 'Front', severity: 'planned', status: 'Proposed', fee: 1500 });
      issues.push({ tooth: 23, label: 'Alignment assessment', condition: 'Malalignment', treatment: 'Orthodontic review', surface: 'Front', severity: 'planned', status: 'Proposed', fee: 1500 });
    }

    if (issueText.includes('whitening') || issueText.includes('cosmetic') || issueText.includes('smile')) {
      issues.push({ tooth: 11, label: 'Shade mismatch', condition: 'Discoloration', treatment: 'Whitening shade analysis', surface: 'Front', severity: 'planned', status: 'Proposed', fee: 3500 });
      issues.push({ tooth: 21, label: 'Shade mismatch', condition: 'Discoloration', treatment: 'Whitening shade analysis', surface: 'Front', severity: 'planned', status: 'Proposed', fee: 3500 });
    }

    if (issues.length === 0) {
      issues.push({ tooth: 22, label: selectedAppointment.service || 'Dental examination', condition: 'Clinical finding', treatment: selectedAppointment.service || 'Dental examination', surface: 'Front', severity: 'planned', status: 'Proposed', fee: 1800 });
      issues.push({ tooth: 18, label: 'Clinical inspection', condition: 'Watch area', treatment: 'Monitor and review', surface: 'Top', severity: 'watch', status: 'Condition', fee: 500 });
    }

    return issues;
  }, [selectedAppointment]);

  const clinicalCriteria = [
    { label: 'Chief Complaint', value: selectedAppointment?.comments || selectedAppointment?.service || 'General consultation' },
    { label: 'Priority', value: selectedIssues.some((issue) => issue.severity === 'critical') ? 'High' : 'Routine' },
    { label: 'Diagnosis Model', value: 'History, visual exam, percussion, vitality test, radiograph if required' },
    { label: 'Consent', value: 'Treatment plan and estimate to be confirmed before procedure' },
  ];

  const prescriptions = [
    { name: 'Pain management', instruction: 'Ibuprofen 400mg after food if pain is present', duration: '3 days' },
    { name: 'Oral rinse', instruction: 'Chlorhexidine mouth rinse twice daily', duration: '5 days' },
    { name: 'Follow-up', instruction: 'Review after clinical examination and diagnosis', duration: selectedAppointment?.appointmentDate || 'Next visit' },
  ];

  const paymentSummary = {
    consultation: 500,
    estimatedTreatment: selectedIssues.some((issue) => issue.severity === 'critical') ? 4500 : 1800,
    paid: 0,
  };

  const totalEstimate = paymentSummary.consultation + paymentSummary.estimatedTreatment;
  const balanceAmount = totalEstimate - paymentSummary.paid;

  const getToothIssue = (tooth) => selectedIssues.find((issue) => issue.tooth === tooth);

  const odontogramRows = [
    {
      id: 'upper',
      label: 'Maxillary',
      teeth: [
        18, 17, 16, 15, 14, 13, 12, 11,
        21, 22, 23, 24, 25, 26, 27, 28,
      ],
    },
    {
      id: 'lower',
      label: 'Mandibular',
      teeth: [
        48, 47, 46, 45, 44, 43, 42, 41,
        31, 32, 33, 34, 35, 36, 37, 38,
      ],
    },
  ];

  const toothSurfaces = ['Front', 'Top', 'Back'];

  const carePanelOptions = [
    { label: 'Exam', tone: 'planned' },
    { label: 'Inlay / Onlay', tone: 'planned' },
    { label: 'X-Rays', tone: 'planned' },
    { label: 'Veneers', tone: 'planned' },
    { label: 'Crown Delivery', tone: 'planned' },
    { label: 'Nightguards', tone: 'planned' },
    { label: 'Two stage implant', tone: 'critical' },
    { label: 'Bridge Abutment', tone: 'planned' },
    { label: 'Perlo / SRP', tone: 'planned' },
    { label: 'Bridge Pontic', tone: 'planned' },
    { label: 'Seal / Prev-Rest', tone: 'planned' },
    { label: 'Bridge', tone: 'critical' },
    { label: 'Composite', tone: 'planned' },
    { label: 'Partial Denture', tone: 'planned' },
    { label: 'Amalgam', tone: 'planned' },
    { label: '+', tone: 'add' },
    { label: 'Caries', tone: 'watch' },
    { label: 'Dent / Part Other', tone: 'planned' },
    { label: 'Oral Cancer', tone: 'info' },
    { label: 'Missing', tone: 'watch' },
    { label: 'Prophy / Fl', tone: 'planned' },
    { label: 'Watch', tone: 'watch' },
    { label: 'Implant', tone: 'planned' },
    { label: 'Ozone', tone: 'planned' },
    { label: '+', tone: 'add' },
    { label: 'Cavitation', tone: 'watch' },
    { label: 'Root Canal', tone: 'planned' },
    { label: 'Products', tone: 'planned' },
    { label: 'Pulp Procedure', tone: 'planned' },
    { label: 'Tx Notes', tone: 'info' },
  ];

  const patientViews = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'diagram', label: 'Teeth Diagram', icon: ClipboardList },
    { id: 'prescription', label: 'Prescription', icon: FileText },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  const handleCredentialChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLoginError('');
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (credentials.username === 'doctor' && credentials.password === '1234') {
      setIsLoading(true);
      setFetchError('');
      setIsAuthenticated(true);
      setLoginError('');
      setCredentials({ username: '', password: '' });
      return;
    }

    setLoginError('Invalid username or password.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAppointments([]);
    setIsLoading(false);
    setFetchError('');
    setSearchTerm('');
    setFilterDates({ from: '', to: '' });
    setSelectedAppointmentId('');
    setActivePatientView('diagram');
  };

  const handleClose = () => {
    setLoginError('');
    onClose();
  };

  const formatCreatedAt = (createdAt) => {
    if (!createdAt?.toDate) {
      return 'Just now';
    }

    return createdAt.toDate().toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const sendPaymentLink = (method) => {
    if (!selectedAppointment) {
      return;
    }

    const digitsOnlyPhone = selectedAppointment.phone?.replace(/\D/g, '') || '';
    const whatsappPhone = digitsOnlyPhone.length === 10 ? `91${digitsOnlyPhone}` : digitsOnlyPhone;
    const upiId = clinicUpiId.trim();
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('AI Dental')}&am=${balanceAmount}&cu=INR&tn=${encodeURIComponent(`Dental bill for ${selectedAppointment.name}`)}`;
    const message = [
      `Hello ${selectedAppointment.name},`,
      '',
      `Your AI Dental bill amount is ₹${balanceAmount}.`,
      `Selected payment mode: ${method}.`,
      `UPI ID: ${upiId}`,
      `Payment link: ${upiLink}`,
      '',
      'Please share the payment screenshot after completing the payment.',
    ].join('\n');

    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="doctor-portal-overlay" onClick={handleClose}>
      <section className="doctor-portal" onClick={(event) => event.stopPropagation()}>
        <button className="doctor-close-btn" onClick={handleClose} aria-label="Close doctor portal">
          <X size={22} />
        </button>

        {!isAuthenticated ? (
          <div className="doctor-login-panel">
            <div className="doctor-login-visual">
              <div className="doctor-login-icon">
                <Stethoscope size={36} />
              </div>
              <p>AI Dental</p>
              <h2>Doctor Dashboard</h2>
              <span>Secure access for appointment requests and patient details.</span>
            </div>

            <form className="doctor-login-form" onSubmit={handleLogin}>
              <h3>Doctor Login</h3>
              <label htmlFor="doctor-username">Username</label>
              <div className="doctor-input-wrap">
                <User size={18} />
                <input
                  id="doctor-username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleCredentialChange}
                  placeholder="doctor"
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="doctor-password">Password</label>
              <div className="doctor-input-wrap">
                <Lock size={18} />
                <input
                  id="doctor-password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleCredentialChange}
                  placeholder="1234"
                  autoComplete="current-password"
                  required
                />
              </div>

              {loginError && (
                <div className="doctor-error">
                  <AlertCircle size={16} />
                  {loginError}
                </div>
              )}

              <button className="btn btn-primary doctor-login-submit" type="submit">
                Login to Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="doctor-dashboard clinical-dashboard">
            <div className="doctor-dashboard-header">
              <div>
                <p>Doctor Dashboard</p>
                <h2>Patient Management</h2>
              </div>
              <button className="doctor-logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>

            <div className="dashboard-metric-grid">
              {dashboardMetricCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article className="dashboard-metric-card" key={card.label}>
                    <div className={`metric-icon ${card.tone}`}>
                      <Icon size={26} />
                    </div>
                    <span className={`metric-badge ${card.tone}`}>{card.badge}</span>
                    <strong>{card.value}</strong>
                    <p>{card.label}</p>
                  </article>
                );
              })}
            </div>

            <div className="dashboard-filter-card">
              <label className="filter-search-field">
                <span>Search Patient</span>
                <div>
                  <Search size={22} />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Name, phone or clinical issue..."
                  />
                </div>
              </label>

              <label className="filter-date-field">
                <span>From Date</span>
                <input
                  type="date"
                  value={filterDates.from}
                  onChange={(event) => setFilterDates((prev) => ({ ...prev, from: event.target.value }))}
                />
              </label>

              <label className="filter-date-field">
                <span>To Date</span>
                <input
                  type="date"
                  value={filterDates.to}
                  onChange={(event) => setFilterDates((prev) => ({ ...prev, to: event.target.value }))}
                />
              </label>

              <button className="filter-action-btn" type="button" aria-label="Apply filters">
                <Filter size={26} />
              </button>
            </div>

            <div className="dashboard-mini-summary">
              <span>Today: <strong>{todayCount}</strong></span>
              <span>Next Slot: <strong>{nextAppointment ? `${nextAppointment.appointmentDate} ${nextAppointment.timeSlot}` : 'None'}</strong></span>
            </div>

            {fetchError && (
              <div className="doctor-error dashboard-error">
                <AlertCircle size={16} />
                {fetchError}
              </div>
            )}

            <div className="clinical-workspace">
              <aside className="patient-selector-panel">
                <div className="panel-heading">
                  <span>Patients</span>
                  <strong>{filteredAppointments.length}</strong>
                </div>

                <div className="appointments-list patient-picker-list">
                  {isLoading ? (
                    <div className="appointments-empty">Loading appointments...</div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="appointments-empty">No appointments found.</div>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <button
                        className={`patient-picker-card ${selectedAppointment?.id === appointment.id ? 'active' : ''}`}
                        key={appointment.id}
                        onClick={() => setSelectedAppointmentId(appointment.id)}
                      >
                        <span className="patient-avatar">{appointment.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                        <span className="patient-picker-content">
                          <strong>{appointment.name}</strong>
                          <small>{appointment.service}</small>
                          <em>{appointment.appointmentDate} at {appointment.timeSlot}</em>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </aside>

              <section className="patient-record-panel">
                {selectedAppointment ? (
                  <>
                    <div className="patient-record-header">
                      <div className="patient-identity">
                        <span className="patient-photo">{selectedAppointment.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                        <div>
                          <h3>{selectedAppointment.name}</h3>
                          <p>{selectedAppointment.appointmentType} · {selectedAppointment.service}</p>
                        </div>
                      </div>

                      <div className="patient-quick-meta">
                        <span><Phone size={15} /> {selectedAppointment.phone}</span>
                        <span><CalendarDays size={15} /> {selectedAppointment.appointmentDate}</span>
                        <span><Clock size={15} /> {selectedAppointment.timeSlot}</span>
                      </div>
                    </div>

                    <div className="patient-view-tabs">
                      {patientViews.map((view) => {
                        const Icon = view.icon;
                        return (
                          <button
                            key={view.id}
                            className={activePatientView === view.id ? 'active' : ''}
                            onClick={() => setActivePatientView(view.id)}
                          >
                            <Icon size={16} />
                            {view.label}
                          </button>
                        );
                      })}
                    </div>

                    {activePatientView === 'overview' && (
                      <div className="record-grid">
                        <section className="record-card large">
                          <div className="record-card-title">
                            <Activity size={18} />
                            Clinical Criteria
                          </div>
                          <div className="criteria-list">
                            {clinicalCriteria.map((item) => (
                              <div key={item.label}>
                                <span>{item.label}</span>
                                <strong>{item.value}</strong>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="record-card">
                          <div className="record-card-title">
                            <ShieldCheck size={18} />
                            Care Process
                          </div>
                          <ol className="care-process">
                            <li>Patient history and vitals</li>
                            <li>Intraoral examination</li>
                            <li>Teeth charting and diagnosis</li>
                            <li>Treatment plan approval</li>
                            <li>Prescription and payment closure</li>
                          </ol>
                        </section>
                      </div>
                    )}

                    {activePatientView === 'diagram' && (
                      <div className="odontogram-layout">
                        <section className="record-card odontogram-card odontogram-wide">
                          <div className="odontogram-toolbar">
                            <div className="record-card-title">
                              <ClipboardList size={18} />
                              Odontogram Chart
                            </div>
                            <div className="diagram-legend">
                              <span><i className="critical-dot" /> Urgent</span>
                              <span><i className="watch-dot" /> Condition</span>
                              <span><i className="planned-dot" /> Planned</span>
                            </div>
                          </div>

                          <div className="odontogram-board">
                            {odontogramRows.map((row) => (
                              <div className={`odontogram-row ${row.id}`} key={row.id}>
                                <div className="arch-label">{row.label}</div>
                                <div className="surface-labels">
                                  {toothSurfaces.map((surface) => (
                                    <span key={surface}>{surface}</span>
                                  ))}
                                </div>
                                <div className="tooth-chart-row">
                                  {row.teeth.map((tooth) => {
                                    const issue = getToothIssue(tooth);
                                    return (
                                      <div className={`chart-tooth ${issue ? issue.severity : ''}`} key={tooth}>
                                        <span className="tooth-number">{tooth}</span>
                                        <div className="surface-stack">
                                          {toothSurfaces.map((surface) => {
                                            const isMarked = issue && (issue.surface === surface || issue.surface === 'All');
                                            return (
                                              <button
                                                key={surface}
                                                className={`tooth-surface ${isMarked ? issue.severity : ''}`}
                                                title={isMarked ? `${issue.condition}: ${issue.label}` : `Tooth ${tooth} ${surface}`}
                                              >
                                                {isMarked && <span />}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="odontogram-table-wrap">
                            <table className="odontogram-table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Tooth</th>
                                  <th>Surface</th>
                                  <th>Condition</th>
                                  <th>Treatment</th>
                                  <th>Status</th>
                                  <th>Fee</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedIssues.map((issue) => (
                                  <tr key={`${issue.tooth}-${issue.condition}`}>
                                    <td>{selectedAppointment.appointmentDate}</td>
                                    <td>{issue.tooth}</td>
                                    <td>{issue.surface}</td>
                                    <td>{issue.condition}</td>
                                    <td>{issue.treatment}</td>
                                    <td><span className={`status-pill ${issue.severity}`}>{issue.status}</span></td>
                                    <td>₹{issue.fee}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </section>

                        <aside className="record-card treatment-panel">
                          <div className="care-panel-tabs">
                            {['Treatment / Conditions', 'Clinical Software'].map((tab) => (
                              <button className={tab === 'Treatment / Conditions' ? 'active' : ''} key={tab}>
                                {tab}
                              </button>
                            ))}
                          </div>

                          <div className="care-status-tabs">
                            {['Planned', 'Existing', 'Completed'].map((status) => (
                              <button
                                className={carePanelStatus === status ? 'active' : ''}
                                key={status}
                                onClick={() => setCarePanelStatus(status)}
                              >
                                {status}
                              </button>
                            ))}
                          </div>

                          <div className="care-select-stack">
                            <select value={selectedAppointment.appointmentDate} onChange={() => {}}>
                              <option>{selectedAppointment.appointmentDate} at {selectedAppointment.timeSlot}</option>
                            </select>
                            <select value="AI Dental Clinic" onChange={() => {}}>
                              <option>AI Dental Clinic</option>
                              <option>Bright Smiles Eagan</option>
                            </select>
                            <select value="Dr. AI Dental" onChange={() => {}}>
                              <option>Dr. AI Dental</option>
                              <option>Dr. Jonathan Higgins</option>
                            </select>
                          </div>

                          <div className="care-panel-heading">
                            <div className="record-card-title">
                              <AlertCircle size={18} />
                              Care panel type
                            </div>
                            <button className="care-add-btn" type="button">+ Add</button>
                          </div>

                          <select className="care-type-select" value="General dentistry" onChange={() => {}}>
                            <option>General dentistry</option>
                            <option>Cosmetic dentistry</option>
                            <option>Orthodontics</option>
                            <option>Oral surgery</option>
                          </select>

                          <div className="treatment-option-grid care-panel-grid">
                            {carePanelOptions.map((option, index) => (
                              <button className={`treatment-chip ${option.tone}`} key={`${option.label}-${index}`}>
                                {option.label}
                              </button>
                            ))}
                          </div>

                          <div className="issue-list detailed">
                            {selectedIssues.map((issue) => (
                              <div key={`${issue.tooth}-${issue.label}`}>
                                <span>Tooth {issue.tooth} · {issue.surface}</span>
                                <strong>{issue.label}</strong>
                                <small>{issue.condition} · {issue.treatment}</small>
                                <em>{issue.status}</em>
                              </div>
                            ))}
                          </div>
                        </aside>
                      </div>
                    )}

                    {activePatientView === 'prescription' && (
                      <div className="record-grid">
                        <section className="record-card large">
                          <div className="record-card-title">
                            <Pill size={18} />
                            Prescription
                          </div>
                          <div className="prescription-list">
                            {prescriptions.map((prescription) => (
                              <div key={prescription.name}>
                                <strong>{prescription.name}</strong>
                                <span>{prescription.instruction}</span>
                                <em>{prescription.duration}</em>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="record-card">
                          <div className="record-card-title">
                            <FileText size={18} />
                            Clinical Notes
                          </div>
                          <p className="record-note">{selectedAppointment.comments || 'No patient notes added yet.'}</p>
                          <p className="record-note muted">Submitted: {formatCreatedAt(selectedAppointment.createdAt)}</p>
                        </section>
                      </div>
                    )}

                    {activePatientView === 'payment' && (
                      <div className="record-grid">
                        <section className="record-card large payment-card">
                          <div className="record-card-title">
                            <CreditCard size={18} />
                            Payment Summary
                          </div>
                          <div className="payment-rows">
                            <div><span>Consultation</span><strong>₹{paymentSummary.consultation}</strong></div>
                            <div><span>Estimated Treatment</span><strong>₹{paymentSummary.estimatedTreatment}</strong></div>
                            <div><span>Paid</span><strong>₹{paymentSummary.paid}</strong></div>
                            <div className="total"><span>Balance Estimate</span><strong>₹{totalEstimate - paymentSummary.paid}</strong></div>
                          </div>
                        </section>

                        <section className="record-card">
                          <div className="record-card-title">
                            <ShieldCheck size={18} />
                            Send Payment Link
                          </div>
                          <div className="payment-link-panel">
                            <label htmlFor="clinic-upi-id">Clinic UPI ID</label>
                            <input
                              id="clinic-upi-id"
                              type="text"
                              value={clinicUpiId}
                              onChange={(event) => setClinicUpiId(event.target.value)}
                              placeholder="clinic@upi"
                            />
                            <div className="payment-method-actions">
                              {['Cash', 'UPI', 'Card'].map((method) => (
                                <button
                                  key={method}
                                  type="button"
                                  onClick={() => sendPaymentLink(method)}
                                  disabled={!clinicUpiId.trim() || !selectedAppointment.phone}
                                >
                                  Send {method}
                                </button>
                              ))}
                            </div>
                            <p>WhatsApp message includes exact amount ₹{balanceAmount} and the UPI payment link.</p>
                          </div>
                        </section>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="appointments-empty">Select a patient to view dental records.</div>
                )}
              </section>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DoctorPortal;

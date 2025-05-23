import React, { useState } from 'react';
import './AppointmentForm.css';

// Données fictives des hôpitaux et leurs médecins
const hospitals = [
  {
    id: 1,
    name: "Hôpital Central",
    address: "123 rue de la Santé, 75001 Paris",
    doctors: [
      { id: 1, name: "Dr. Sophie Martin", speciality: "Médecin généraliste", availability: "Lun-Ven, 9h-17h" },
      { id: 2, name: "Dr. Pierre Dubois", speciality: "Cardiologue", availability: "Mar-Sam, 8h-16h" }
    ]
  },
  {
    id: 2,
    name: "Clinique Saint-Joseph",
    address: "45 avenue des Lilas, 75016 Paris",
    doctors: [
      { id: 3, name: "Dr. Marie Lambert", speciality: "Dermatologue", availability: "Lun-Jeu, 9h-18h" },
      { id: 4, name: "Dr. Thomas Bernard", speciality: "Pédiatre", availability: "Mar-Ven, 8h-17h" }
    ]
  }
];

// Créneaux horaires disponibles
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

const AppointmentForm = () => {
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // Obtenir la date minimum (aujourd'hui) et maximum (dans 3 mois)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi de données
    const appointmentData = {
      hospital: selectedHospital,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason
    };
    console.log('Rendez-vous demandé:', appointmentData);
    alert('Votre demande de rendez-vous a été enregistrée. Nous vous contacterons pour confirmation.');
  };

  // Filtrer les médecins en fonction de l'hôpital sélectionné
  const filteredDoctors = selectedHospital 
    ? hospitals.find(h => h.id === parseInt(selectedHospital))?.doctors || []
    : [];

  return (
    <div className="appointment-container">
      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="appointment-header">
          <h1><i className="fas fa-calendar-check"></i> Prise de rendez-vous</h1>
          <p>Remplissez le formulaire ci-dessous pour demander un rendez-vous avec l'un de nos médecins.</p>
        </div>

        <div className="location-group">
          <div className="form-group">
            <label htmlFor="hospital">
              <i className="fas fa-hospital"></i> Hôpital
            </label>
            <select 
              id="hospital" 
              value={selectedHospital} 
              onChange={(e) => {
                setSelectedHospital(e.target.value);
                setSelectedDoctor('');
              }}
              required
            >
              <option value="">Sélectionnez un hôpital</option>
              {hospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doctor">
              <i className="fas fa-user-md"></i> Médecin
            </label>
            <select 
              id="doctor" 
              value={selectedDoctor} 
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              disabled={!selectedHospital}
            >
              <option value="">Sélectionnez un médecin</option>
              {filteredDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.speciality}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="datetime-group">
          <div className="form-group">
            <label htmlFor="date">
              <i className="fas fa-calendar-alt"></i> Date souhaitée
            </label>
            <input 
              type="date" 
              id="date"
              min={today}
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">
              <i className="fas fa-clock"></i> Horaire préféré
            </label>
            <select 
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">Sélectionnez un horaire</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">
            <i className="fas fa-comment-medical"></i> Motif de la consultation
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Décrivez brièvement la raison de votre consultation"
            required
          />
        </div>

        {selectedDoctor && (
          <div className="doctor-availability">
            <h3><i className="fas fa-info-circle"></i> Disponibilités du médecin</h3>
            <div className="availability-grid">
              {filteredDoctors
                .filter(doctor => doctor.id === parseInt(selectedDoctor))
                .map(doctor => (
                  <div key={doctor.id} className="availability-card">
                    <h4>{doctor.name}</h4>
                    <p className="speciality">{doctor.speciality}</p>
                    <p className="days">Horaires de consultation :</p>
                    <ul>
                      <li>{doctor.availability}</li>
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}

        <button type="submit" className="submit-button">
          <i className="fas fa-check-circle"></i> Demander un rendez-vous
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm; 
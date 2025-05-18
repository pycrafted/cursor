import React, { useState } from 'react';
import './AppointmentForm.css';

// Données fictives des médecins
const doctors = [
  { id: 1, name: "Dr. Sophie Martin", speciality: "Médecin généraliste", availableDays: ["Lundi", "Mardi", "Jeudi"] },
  { id: 2, name: "Dr. Pierre Dubois", speciality: "Cardiologue", availableDays: ["Mercredi", "Vendredi"] },
  { id: 3, name: "Dr. Marie Lambert", speciality: "Dermatologue", availableDays: ["Lundi", "Mercredi", "Vendredi"] },
  { id: 4, name: "Dr. Thomas Bernard", speciality: "Pédiatre", availableDays: ["Mardi", "Jeudi"] }
];

// Créneaux horaires disponibles
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

const AppointmentForm = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Obtenir la date minimum (aujourd'hui) et maximum (dans 3 mois)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi de données
    const appointmentData = {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason,
      isUrgent
    };
    console.log('Rendez-vous demandé:', appointmentData);
    alert('Votre demande de rendez-vous a été enregistrée. Nous vous contacterons pour confirmation.');
  };

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1>Prise de rendez-vous</h1>
        <p>Remplissez le formulaire ci-dessous pour demander un rendez-vous avec l'un de nos médecins.</p>
      </div>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="doctor">Médecin :</label>
          <select 
            id="doctor" 
            value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">Sélectionnez un médecin</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.speciality}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date souhaitée :</label>
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
          <label htmlFor="time">Horaire préféré :</label>
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

        <div className="form-group">
          <label htmlFor="reason">Motif de la consultation :</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Décrivez brièvement la raison de votre consultation"
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
            />
            Consultation urgente
          </label>
        </div>

        <div className="doctor-availability">
          <h3>Disponibilités des médecins</h3>
          <div className="availability-grid">
            {doctors.map(doctor => (
              <div key={doctor.id} className="availability-card">
                <h4>{doctor.name}</h4>
                <p className="speciality">{doctor.speciality}</p>
                <p className="days">Jours de consultation :</p>
                <ul>
                  {doctor.availableDays.map(day => (
                    <li key={day}>{day}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Demander un rendez-vous
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm; 
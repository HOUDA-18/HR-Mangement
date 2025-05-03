import React, { useState } from 'react';
import './interviewAlert.scss';
import axios from 'axios';

const InterviewAlert = ({  onClose, applicationId }) => {
  const [meeting, setMeeting] = useState({
    topic: '',
    start_time: '',
    duration: '',
    agenda: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setMeeting({ ...meeting, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!meeting.topic) tempErrors.topic = "Topic is required.";
    if (!meeting.start_time) tempErrors.start_time = "Start time is required.";
    if (!meeting.duration || isNaN(meeting.duration) || meeting.duration <= 0) tempErrors.duration = "Duration must be a positive number.";
    if (!meeting.agenda) tempErrors.agenda = "Agenda is required.";
    setErrors(tempErrors);
    console.log('="tempErrors: ',tempErrors)

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Meeting Created:\n" + JSON.stringify(meeting, null, 2));
        try {
          const response = await axios.post(`http://localhost:8070/api/candidatures/addMeeting/${applicationId}`,meeting)
          console.log("response: ",response.data)
          onClose()
        } catch (error) {
          console.log("error: ",error)
          onClose()
        }
    }
  };
 // if not open, render nothing

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Create Meeting</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Topic:</label>
            <input
              type="text"
              name="topic"
              value={meeting.topic}
              onChange={handleChange}
            />
            {errors.topic && <p className="error">{errors.topic}</p>}
          </div>

          <div className="form-group">
            <label>Start Time:</label>
            <input
              type="datetime-local"
              name="start_time"
              value={meeting.start_time}
              onChange={handleChange}
            />
            {errors.start_time && <p className="error">{errors.start_time}</p>}
          </div>

          <div className="form-group">
            <label>Duration (minutes):</label>
            <input
              type="number"
              name="duration"
              value={meeting.duration}
              onChange={handleChange}
            />
            {errors.duration && <p className="error">{errors.duration}</p>}
          </div>

          <div className="form-group">
            <label>Agenda:</label>
            <textarea
              name="agenda"
              value={meeting.agenda}
              onChange={handleChange}
            />
            {errors.agenda && <p className="error">{errors.agenda}</p>}
          </div>

          <button type="submit" className="submit-btn">Create Meeting</button>
        </form>
      </div>
    </div>
  );
};

export default InterviewAlert;

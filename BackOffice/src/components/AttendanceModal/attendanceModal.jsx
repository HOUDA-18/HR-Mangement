import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import AttendanceComponent from 'components/attendance_component/attendanceComponent';
import './attendanceModal.scss';  // Import the SCSS file


const ModalAttendance = ({  onClose }) => {
  console.log('insideModale')
  return (
    <div className="attendance-overlay">
        <div className="attendance-header">
          <button onClick={onClose} className="close-button">
            X
          </button>
        </div>
        <div >
                <AttendanceComponent/> 
                
            </div>
    </div>
  );
};

export default ModalAttendance;

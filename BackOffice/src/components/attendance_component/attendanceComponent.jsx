import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';



const AttendanceComponent = () => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  const captureFace = () => webcamRef.current.getScreenshot();

  const verifyFace = async () => {
    const imageSrc = captureFace();
    if (!imageSrc) throw new Error('Face capture failed');
  
    try {
      const faceRes = await axios.post('http://localhost:8070/api/loginface', {
        imageData: imageSrc
      });
  
      if (!faceRes.data.user) {
        throw new Error('Facial verification failed');
      }
  
      return faceRes.data.user._id;
    } catch (err) {
      if (err.response?.status === 401) {
        throw new Error('❌ Not authorized. Please try again.');
      }
      throw err; // rethrow for other catch blocks
    }
  };

  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        () => reject(new Error('Geolocation permission denied'))
      );
    });
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage('');
    try {
      const id = await verifyFace();
      setUserId(id);

      const { latitude, longitude } = await getGeolocation();
      const res = await axios.post('http://localhost:8070/api/attendance/checkin', {
        latitude,
        longitude,
        timestamp: new Date(),
        employeeId: id
      });

      setMessage(res.data.message);
      setCheckedIn(true);
      localStorage.setItem('checkedIn', 'true');
      localStorage.setItem('checkDate', new Date().toDateString());
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage('🕒 You have already checked in today.');
        setCheckedIn(true);
        localStorage.setItem('checkedIn', 'true');
        localStorage.setItem('checkDate', new Date().toDateString());
      } else {
        setMessage(err.message || '❌ Error during check-in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setMessage('');
    try {
      const id = await verifyFace();
      const { latitude, longitude } = await getGeolocation();

      const res = await axios.post('http://localhost:8070/api/attendance/checkout', {
        latitude,
        longitude,
        timestamp: new Date(),
        employeeId: id
      });

      if (res.data.alreadyCheckedOut) {
        setMessage('🕒 You have already checked out today.');
        setCheckedOut(true);
      } else {
        setMessage(res.data.message);
        setCheckedOut(true);
      }

      localStorage.setItem('checkedOut', 'true');
      localStorage.setItem('checkDate', new Date().toDateString());
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error during check-out.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const id = userId || await verifyFace();
      const res = await axios.get(`http://localhost:8070/api/attendance/user/${id}`);
      setAttendanceData(res.data.attendance || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const getTileClassName = ({ date }) => {
    const targetDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  
    const match = attendanceData.find((entry) => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === targetDate;
    });
  
    if (match) {
      switch (match.status) {
        case 'on time': return 'status-on-time';
        case 'late': return 'status-late';
        case 'early': return 'status-early';
        case 'absent': return 'status-absent';
        default: return 'status-on-time';
      }
    }
  
    const today = new Date();
    const isPast = date < today && date.toDateString() !== today.toDateString();
    return isPast ? 'status-absent' : '';
  };
  

  const handleDayClick = (date) => {
    const dayStr = date.toDateString();
    const entry = attendanceData.find(
      (d) => new Date(d.date).toDateString() === dayStr
    );

     setSelectedDateInfo(entry ? {
      date: dayStr,
      checkIn: entry.checkIn ? entry.checkin_status +" at "+ new Date(entry.checkIn).toLocaleTimeString() : '',
      checkOut: entry.checkOut ? entry.checkin_status +" at "+ new Date(entry.checkOut).toLocaleTimeString() : '',
      
    } : {
      date: dayStr,
      checkIn: 'Absent',
      checkOut: 'Absent',
      
    }); 
  };

     useEffect(() => {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('checkDate');
      if (storedDate === today) {
        setCheckedIn(localStorage.getItem('checkedIn') === 'true');
        setCheckedOut(localStorage.getItem('checkedOut') === 'true');
      } else {
        localStorage.removeItem('checkedIn');
        localStorage.removeItem('checkedOut');
        localStorage.setItem('checkDate', today);
      }
    }, []); 
 
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: 600, color: '#333' }}>Face Attendance</h2>

        <div style={{ marginBottom: '20px' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 400, height: 300, facingMode: 'user' }}
            style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover' }}
          />
        </div>

        <button onClick={handleCheckIn} disabled={loading || checkedIn} style={{
          padding: '12px 24px', fontSize: '16px', fontWeight: 500, color: '#fff',
          background: loading || checkedIn ? '#888' : '#28a745', border: 'none',
          borderRadius: '8px', cursor: loading || checkedIn ? 'not-allowed' : 'pointer', marginRight: '10px'
        }}>
          {loading ? 'Verifying...' : checkedIn ? 'Checked In' : 'Check In'}
        </button>

        <button onClick={handleCheckOut} disabled={loading || !checkedIn || checkedOut} style={{
          padding: '12px 24px', fontSize: '16px', fontWeight: 500, color: '#fff',
          background: loading || checkedOut ? '#888' : '#dc3545', border: 'none',
          borderRadius: '8px', cursor: loading || checkedOut ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Processing...' : checkedOut ? 'Checked Out' : 'Check Out'}
        </button>

        {/* <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => {
              setShowCalendar(!showCalendar);
              if (!showCalendar) fetchAttendance();
            }}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}>
            {showCalendar ? 'Hide Calendar' : 'Check Attendance'}
          </button>
        </div> */}

        {message && (
          <p style={{
            marginTop: '20px',
            color: message.includes('✅') || message.includes('already checked') ? 'green' : 'red',
            fontWeight: 500
          }}>
            {message}
          </p>
        )}

        {showCalendar && (
          <div style={{ marginTop: '30px' }}>
            <Calendar
              onClickDay={handleDayClick}
              tileClassName={getTileClassName}
            />
            {selectedDateInfo && (
              <div style={{ marginTop: '15px', textAlign: 'left' }}>
                <strong>{selectedDateInfo.date}</strong>
                <p>🟢 Check-in: {selectedDateInfo.checkIn}</p>
                <p>🔴 Check-out: {selectedDateInfo.checkOut}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calendar styles */}
      <style>
        {`
          .status-on-time {
            background: #c8f7c5 !important;
            border-radius: 50%;
          }
          .status-late {
            background: #fff3cd !important;
            border-radius: 50%;
          }
          .status-early {
            background: #cfe2ff !important;
            border-radius: 50%;
          }
          .status-absent {
            background: #f7c5c5 !important;
            border-radius: 50%;
          }`
        }
      </style>
    </div>
  );
};

export default AttendanceComponent;

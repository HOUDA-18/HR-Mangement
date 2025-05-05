import React, { useState, useEffect } from 'react';
import { 
  MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, 
  MDBRow, MDBCol, MDBIcon, MDBBadge, MDBSpinner 
} from 'mdb-react-ui-kit';
import Webcam from 'react-webcam';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';
import './index.scss'
import { useNavigate } from 'react-router-dom';
import ModalAttendance from 'components/AttendanceModal/attendanceModal';
import AttendanceComponent from 'components/attendance_component/attendanceComponent';
/* 
const AttendanceComponent = () => {
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const webcamRef = React.useRef(null);

  // Get user with error handling
  const getUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to parse user data", e);
      return null;
    }
  };

  const user = getUser();

  useEffect(() => {
    if (!user) {
      setError("User not found. Please login.");
      setLoading(false);
      return;
    }

    const fetchTodayAttendance = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`http://localhost:8070/api/attendance/today/${today}`);
        setTodayAttendance(response.data?.attendance || []);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [user]);

  const capture = async () => {
    if (!webcamRef.current) {
      setError("Webcam not initialized");
      return;
    }

    try {
      setLoading(true);
      const imageSrc = webcamRef.current.getScreenshot();
      
      // Replace with your actual API endpoint
      const response = await axios.post('http://localhost:8070/api/face-recognition/check-in', {
        image: imageSrc,
        userId: user?._id
      });
      
      if (response.data?.success) {
        // Refresh data
        const today = new Date().toISOString().split('T')[0];
        const newData = await axios.get(`http://localhost:8070/api/attendance/today/${today}`);
        setTodayAttendance(newData.data?.attendance || []);
      }
    } catch (err) {
      console.error('Face recognition error:', err);
      setError('Face recognition failed');
    } finally {
      setLoading(false);
      setWebcamEnabled(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'on time': { color: 'success', text: 'On Time' },
      'late': { color: 'warning', text: 'Late' },
      'early': { color: 'info', text: 'Early' },
      'absent': { color: 'danger', text: 'Absent' },
    };
    
    const statusInfo = statusMap[status] || { color: 'secondary', text: 'Unknown' };
    return <MDBBadge color={statusInfo.color} pill>{statusInfo.text}</MDBBadge>;
  };

  if (!user) {
    return (
      <div className="container text-center py-5">
        <h4>Please login to access this feature</h4>
        <MDBBtn color="primary" href="/login">
          Go to Login
        </MDBBtn>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h3 className="fw-bold">Face Attendance System</h3>
        
        {webcamEnabled ? (
          <div className="d-flex flex-column align-items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded mb-3"
              style={{ width: '100%', maxWidth: '500px' }}
            />
            <div className="d-flex gap-2">
              <MDBBtn color="success" onClick={capture} disabled={loading}>
                {loading ? (
                  <>
                    <MDBSpinner size="sm" role="status" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <MDBIcon fas icon="check-circle" className="me-2" />
                    Capture & Check In
                  </>
                )}
              </MDBBtn>
              <MDBBtn color="danger" onClick={() => setWebcamEnabled(false)}>
                <MDBIcon fas icon="times-circle" className="me-2" />
                Cancel
              </MDBBtn>
            </div>
          </div>
        ) : (
          <MDBBtn 
            color="primary" 
            onClick={() => setWebcamEnabled(true)}
            disabled={loading}
          >
            <MDBIcon fas icon="camera" className="me-2" />
            Start Face Recognition
          </MDBBtn>
        )}
      </div>

      {error && (
        <div className="alert alert-danger text-center">
          <MDBIcon fas icon="exclamation-triangle" className="me-2" />
          {error}
        </div>
      )}

    </div>
  );
}; */

const FaceCheckIn = () => {
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const webcamRef = React.useRef(null);
  const [showModalAttendance, setShowModalAttendance]=useState(false)

  const navigate = useNavigate()

  const handleModal = ()=>{
    setShowModalAttendance(!showModalAttendance)
  }


  const  showDetails= (id)=>{
    navigate(`/app/dashboard/employees/employeeDetails`,{state:{ values: id}})
  }

  // Get user with error handling
  const getUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to parse user data", e);
      return null;
    }
  };

  const user = getUser();

  useEffect(() => {
    if (!user) {
      setError("User not found. Please login.");
      setLoading(false);
      return;
    }

    const fetchTodayAttendance = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        console.log("today :",today)
        const response = await axios.get(`http://localhost:8070/api/attendance/today`);
        setTodayAttendance(response.data || []);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, []);



  const getStatusBadge = (status) => {
    
    const statusMap = {
      'On Time': { color: 'success', text: 'On Time' },
      'Late': { color: 'warning', text: 'Late' },
      'Early Leave': { color: 'info', text: 'Early' },
      'Absent': { color: 'danger', text: 'Absent' },
    };
    
    const statusInfo = statusMap[status] || { color: 'secondary', text: 'Unknown' };
    return <MDBBadge color={statusInfo.color} pill>{statusInfo.text}</MDBBadge>;
  };



  if (user?.role === "ADMIN_HR") {
    return (
      <>
      <div className="container py-1 text-center">
        <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3>Attendance overview</h3>
            </div>
            <div className="button-container">
              <button
                className="start-btn"
                onClick={handleModal}
                disabled={loading}
              >
                <FaCamera className="me-2" />
                Start Face Recognition
              </button>
            </div>
          </div>
        <div className="mt-3">
            <h4 className="mb-4">
              <MDBIcon far icon="calendar-check" className="me-2 text-primary" />
              Today's Attendance
            </h4>
        
        {loading ? (
          <div className="text-center py-5">
            <MDBSpinner color="primary" />
            <p className="mt-2">Loading attendance data...</p>
          </div>
        ) : todayAttendance.length === 0 ? (
          <div className="text-center py-5">
            <MDBIcon icon="calendar-times" size="2x" className="text-muted mb-3" />
            <p className="text-muted">No attendance records for today</p>
          </div>
        ) : (
          <MDBRow>
                  {todayAttendance.map((record, index) => (
        <MDBCol md="6" lg="4" className="mb-4" key={index}>
          <MDBCard className="h-100 shadow-sm">
            <MDBCardBody>
              <div
                className="d-flex align-items-center mb-3 clickable"
                onClick={() => showDetails(record.employeeId)}
              >
                <MDBCardImage
                  src={record?.photo || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="rounded-circle me-3"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div>
                  <h5 className="mb-0">{record?.firstname || 'Unknown'} {record?.lastname || ''}</h5>
                  <MDBCardText className="text-muted">{record?.role || 'Employee'}</MDBCardText>
                </div>
              </div>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold">Check-in:</span>
                  {record.checkInStatus !== "" ? (
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {getStatusBadge(record.checkInStatus)}
                      <MDBBadge
                        color={record.checkinIsInsideOffice ? "success" : "danger"}
                        pill
                        className="ms-2"
                      >
                        {record.checkinIsInsideOffice ? "Inside" : "Outside"}
                      </MDBBadge>
                    </div>
                  ) : (
                    <MDBBadge color="danger" pill>Absent</MDBBadge>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Check-out:</span>
                  {record.checkOutStatus !== "" ? (
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        {new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {getStatusBadge(record.checkOutStatus)}
                      <MDBBadge
                        color={record.checkoutIsInsideOffice ? "success" : "danger"}
                        pill
                        className="ms-2"
                      >
                        {record.checkoutIsInsideOffice ? "Inside" : "Outside"}
                      </MDBBadge>
                    </div>
                  ) : (
                    <MDBBadge color="secondary" pill>Absent</MDBBadge>
                  )}
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      ))}

          </MDBRow>
        )}

      </div>
      </div>
      {showModalAttendance && <ModalAttendance  onClose={handleModal}/>}

      </>
    );
  }

  return <AttendanceComponent />;
};

export default FaceCheckIn;
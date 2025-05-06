import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBProgress,
  MDBProgressBar,
  MDBBadge,
  MDBTypography,
  MDBTooltip,
} from 'mdb-react-ui-kit';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.values || JSON.parse(localStorage.getItem("user")) || {
    firstname: "John",
    lastname: "Doe",
    matricule: "EMP001",
    email: "john.doe@example.com",
    phone: "+1234567890",
    image: "https://mdbootstrap.com/img/new/avatars/2.jpg",
    department: "Development",
    position: "Full Stack Developer",
    hireDate: new Date().toISOString(),
    _id: "1",
    createdAt: new Date().toISOString()
  };

  const handleUpdate = () => {
    navigate('/app/dashboard/updateProfile', { state: { values: user } });
  };

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`http://localhost:8070/api/attendance/user/${user._id}`);
        setAttendanceData(res.data.attendance || []);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user._id]);

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const createdAt = new Date(user.createdAt);
    const today = new Date();
    const targetDate = date.toISOString().split('T')[0];

    if (date < createdAt) return null;

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
        default: return null;
      }
    }

    const isPast = date < today && date.toDateString() !== today.toDateString();
    return isPast ? 'status-absent' : null;
  };

  const getAttendanceInfo = (date) => {
    const dayStr = date.toDateString();
    const entry = attendanceData.find(
      (d) => new Date(d.date).toDateString() === dayStr
    );

    return entry ? {
      date: dayStr,
      checkIn: entry.checkIn ? `${entry.checkin_status} at ${new Date(entry.checkIn).toLocaleTimeString()}` : 'Not recorded',
      checkOut: entry.checkOut ? `${entry.checkout_status} at ${new Date(entry.checkOut).toLocaleTimeString()}` : 'Not recorded',
      status: entry.isInsideOffice?'inside the office ' : 'outside the office '
    } : {
      date: dayStr,
      checkIn: 'No data',
      checkOut: 'No data',
      status: date < new Date() ? 'absent' : 'future'
    };
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const info = getAttendanceInfo(date);
    const isDisabled = date > new Date() || date < new Date(user.createdAt);
    
    if (isDisabled) return null;

    const statusColor = 
      info.status === 'on time' ? 'success' :
      info.status === 'late' ? 'warning' :
      info.status === 'early' ? 'info' :
      info.status === 'absent' ? 'danger' : 'secondary';

    return (
      <MDBTooltip 
        tag="div"
        wrapperProps={{ style: { display: 'block', height: '100%' } }}
        title={
          <div className="p-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>{info.date}</strong>
              <MDBBadge color={statusColor} pill>
                {info.status}
              </MDBBadge>
            </div>
            <div className="d-flex align-items-center mb-1">
              <MDBIcon icon="clock" className="me-2 text-success" />
              <span>Check-in: {info.checkIn}</span>
            </div>
            <div className="d-flex align-items-center">
              <MDBIcon icon="clock" className="me-2 text-danger" />
              <span>Check-out: {info.checkOut}</span>
            </div>
          </div>
        }
        placement="top"
      >
        <div className="calendar-day-content">
          <div className={`status-dot bg-${statusColor}`} />
        </div>
      </MDBTooltip>
    );
  };

  const attendanceStats = attendanceData.reduce((acc, entry) => {
    acc.totalDays++;
    if (entry.status === 'on time') acc.onTime++;
    if (entry.status === 'late') acc.late++;
    if (entry.status === 'early') acc.early++;
    if (entry.status === 'absent') acc.absent++;
    return acc;
  }, { totalDays: 0, onTime: 0, late: 0, early: 0, absent: 0 });

  return (
    <section style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center">
          <MDBCol lg="10">
            <MDBCard className="mb-4 shadow-sm">
              <MDBCardBody className="p-4">
                <MDBRow>
                  <MDBCol md="4" className="text-center">
                    <MDBCardImage
                      src={user.image}
                      alt="avatar"
                      className="rounded-circle shadow-1-strong mb-4"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      fluid
                    />
                    
                    <MDBTypography tag="h5" className="mb-1">{user.firstname} {user.lastname}</MDBTypography>
                    <MDBCardText className="text-muted mb-2">{user.position}</MDBCardText>
                    
                    <div className="d-flex justify-content-center mb-2">
                      <MDBBtn 
                        onClick={handleUpdate}
                        color="primary"
                        size="sm"
                        className="rounded-pill px-4"
                      >
                        <MDBIcon fas icon="user-edit" className="me-2" />
                        Edit Profile
                      </MDBBtn>
                    </div>
                    
                    <div className="d-flex justify-content-center">
                      <MDBBtn
                        tag="a"
                        color="primary"
                        floating
                        size="sm"
                        className="mx-1"
                        href="#!"
                      >
                        <MDBIcon fab icon="facebook-f" />
                      </MDBBtn>
                      <MDBBtn
                        tag="a"
                        color="primary"
                        floating
                        size="sm"
                        className="mx-1"
                        href="#!"
                      >
                        <MDBIcon fab icon="twitter" />
                      </MDBBtn>
                      <MDBBtn
                        tag="a"
                        color="primary"
                        floating
                        size="sm"
                        className="mx-1"
                        href="#!"
                      >
                        <MDBIcon fab icon="linkedin-in" />
                      </MDBBtn>
                    </div>
                  </MDBCol>
                  
                  <MDBCol md="8">
                    <MDBTypography tag="h5" className="mb-3">Personal Information</MDBTypography>
                    
                    <MDBRow className="mb-3">
                      <MDBCol sm="3"><MDBCardText className="fw-bold">Full Name</MDBCardText></MDBCol>
                      <MDBCol sm="9"><MDBCardText>{user.firstname} {user.lastname}</MDBCardText></MDBCol>
                    </MDBRow>
                    
                    <MDBRow className="mb-3">
                      <MDBCol sm="3"><MDBCardText className="fw-bold">Email</MDBCardText></MDBCol>
                      <MDBCol sm="9"><MDBCardText>{user.email}</MDBCardText></MDBCol>
                    </MDBRow>
                    
                    <MDBRow className="mb-3">
                      <MDBCol sm="3"><MDBCardText className="fw-bold">Phone</MDBCardText></MDBCol>
                      <MDBCol sm="9"><MDBCardText>{user.phone}</MDBCardText></MDBCol>
                    </MDBRow>
                    
                    <MDBRow className="mb-3">
                      <MDBCol sm="3"><MDBCardText className="fw-bold">Matricule</MDBCardText></MDBCol>
                      <MDBCol sm="9"><MDBCardText>{user.matricule}</MDBCardText></MDBCol>
                    </MDBRow>
                    
                    <MDBRow className="mb-3">
                      <MDBCol sm="3"><MDBCardText className="fw-bold">Department</MDBCardText></MDBCol>
                      <MDBCol sm="9"><MDBCardText>{user?.departement?.name}</MDBCardText></MDBCol>
                    </MDBRow>
                    
                    <MDBRow className="mb-3">
                      <MDBCol sm="3"><MDBCardText className="fw-bold">Hire Date</MDBCardText></MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText>
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
            
            <MDBRow>
              <MDBCol md="6" className="mb-4">
                <MDBCard className="shadow-sm h-100">
                  <MDBCardBody>
                    <MDBTypography tag="h5" className="mb-4 d-flex align-items-center">
                      <MDBIcon fas icon="chart-pie" className="me-2 text-primary" />
                      Attendance Overview
                    </MDBTypography>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>On Time <MDBBadge color="success" pill>{attendanceStats.onTime}</MDBBadge></span>
                            <span>{attendanceStats.totalDays > 0 ? Math.round((attendanceStats.onTime / attendanceStats.totalDays) * 100) : 0}%</span>
                          </div>
                          <MDBProgress>
                            <MDBProgressBar bgColor="success" width={attendanceStats.totalDays > 0 ? (attendanceStats.onTime / attendanceStats.totalDays) * 100 : 0} />
                          </MDBProgress>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Late <MDBBadge color="warning" pill>{attendanceStats.late}</MDBBadge></span>
                            <span>{attendanceStats.totalDays > 0 ? Math.round((attendanceStats.late / attendanceStats.totalDays) * 100) : 0}%</span>
                          </div>
                          <MDBProgress>
                            <MDBProgressBar bgColor="warning" width={attendanceStats.totalDays > 0 ? (attendanceStats.late / attendanceStats.totalDays) * 100 : 0} />
                          </MDBProgress>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Early Departure <MDBBadge color="info" pill>{attendanceStats.early}</MDBBadge></span>
                            <span>{attendanceStats.totalDays > 0 ? Math.round((attendanceStats.early / attendanceStats.totalDays) * 100) : 0}%</span>
                          </div>
                          <MDBProgress>
                            <MDBProgressBar bgColor="info" width={attendanceStats.totalDays > 0 ? (attendanceStats.early / attendanceStats.totalDays) * 100 : 0} />
                          </MDBProgress>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Absent <MDBBadge color="danger" pill>{attendanceStats.absent}</MDBBadge></span>
                            <span>{attendanceStats.totalDays > 0 ? Math.round((attendanceStats.absent / attendanceStats.totalDays) * 100) : 0}%</span>
                          </div>
                          <MDBProgress>
                            <MDBProgressBar bgColor="danger" width={attendanceStats.totalDays > 0 ? (attendanceStats.absent / attendanceStats.totalDays) * 100 : 0} />
                          </MDBProgress>
                        </div>
                      </>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              
              <MDBCol md="6" className="mb-4">
                <MDBCard className="shadow-sm h-100">
                  <MDBCardBody>
                    <MDBTypography tag="h5" className="mb-4 d-flex align-items-center">
                      <MDBIcon far icon="calendar-alt" className="me-2 text-primary" />
                      Attendance Calendar
                    </MDBTypography>
                    
                    <div className="d-flex justify-content-center mb-3">
                      <Calendar
                        tileContent={tileContent}
                        tileClassName={getTileClassName}
                        tileDisabled={({ date, view }) => 
                          view === 'month' && (date > new Date() || date < new Date(user.createdAt) || date.getDay()==0)
                        }
                        className="border-0 w-100"
                      />
                    </div>
                    
                    <div className="mt-3">
                      <small className="text-muted d-flex align-items-center">
                        <MDBIcon icon="info-circle" className="me-2" />
                        Hover over a date to view attendance details
                      </small>
                    </div>
                    
                    <div className="mt-3 d-flex flex-wrap gap-2">
                      <div className="d-flex align-items-center">
                        <div className="status-dot bg-success me-2" />
                        <small>On Time</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="status-dot bg-warning me-2" />
                        <small>Late</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="status-dot bg-info me-2" />
                        <small>Early</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="status-dot bg-danger me-2" />
                        <small>Absent</small>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            
            <MDBRow>
              <MDBCol md="6" className="mb-4">
                <MDBCard className="shadow-sm h-100">
                  <MDBCardBody>
                    <MDBTypography tag="h5" className="mb-4 d-flex align-items-center">
                      <MDBIcon fas icon="tasks" className="me-2 text-primary" />
                      Current Projects
                    </MDBTypography>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>HR System Redesign</span>
                        <span>75%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="primary" width={75} />
                      </MDBProgress>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Mobile App Development</span>
                        <span>45%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="info" width={45} />
                      </MDBProgress>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>API Integration</span>
                        <span>90%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="success" width={90} />
                      </MDBProgress>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>UI/UX Improvements</span>
                        <span>30%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="warning" width={30} />
                      </MDBProgress>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              
              <MDBCol md="6" className="mb-4">
                <MDBCard className="shadow-sm h-100">
                  <MDBCardBody>
                    <MDBTypography tag="h5" className="mb-4 d-flex align-items-center">
                      <MDBIcon fas icon="certificate" className="me-2 text-primary" />
                      Skills & Expertise
                    </MDBTypography>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>JavaScript/React</span>
                        <span>90%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="primary" width={90} />
                      </MDBProgress>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Node.js/Express</span>
                        <span>85%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="primary" width={85} />
                      </MDBProgress>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>UI/UX Design</span>
                        <span>75%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="info" width={75} />
                      </MDBProgress>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Database Management</span>
                        <span>80%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="success" width={80} />
                      </MDBProgress>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Project Management</span>
                        <span>70%</span>
                      </div>
                      <MDBProgress>
                        <MDBProgressBar bgColor="warning" width={70} />
                      </MDBProgress>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <style>
        {`
          .status-on-time { 
            background: #d4edda !important; 
            color: #155724;
          }
          .status-late { 
            background: #fff3cd !important; 
            color: #856404;
          }
          .status-early { 
            background: #cce5ff !important; 
            color: #004085;
          }
          .status-absent { 
            background: #f8d7da !important; 
            color: #721c24;
          }
          .react-calendar {
            border: none !important;
            width: 100% !important;
          }
          .react-calendar__tile--active {
            background: #f0f0f0 !important;
            color: #000 !important;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background: #e6e6e6 !important;
          }
          .calendar-day-content {
            position: absolute;
            bottom: 5px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .tooltip-inner {
            text-align: left;
            max-width: 250px;
          }
          .card {
            transition: transform 0.2s ease-in-out;
          }
          .card:hover {
            transform: translateY(-5px);
          }
          .react-calendar__tile {
            position: relative;
            padding-bottom: 20px;
          }
        `}
      </style>
    </section>
  );
}
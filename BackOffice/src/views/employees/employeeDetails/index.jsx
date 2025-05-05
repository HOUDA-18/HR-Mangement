import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./index.scss"
import Chart from 'components/Chart/chart';
import SkillRadarChart from 'components/SpiderChartEmployee/spiderChartEmployee';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

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
import Calendar from 'react-calendar';
import SkillsDisplay from 'components/skillsComponent/skillsComponent';
const employeeDetails = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const [attendanceData, setAttendanceData] = useState([]);

    const [employee, setEmployee]= useState({
    _id: "",
    firstname: "",
    lastname: "",
    matricule: "",
    email: "",
    phone: "",
    image: "",
    status: "",
    role: "",
    createdAt: "",
    departement: "",
    technical_skills_evaluation: [],
    skills: [],
    soft_skills_evaluation: []
    })
    const userId = location.state?.values
    const currentUser = JSON.parse(localStorage.getItem("user"))

    const handleEdit=()=>{
        navigate('/app/dashboard/updateProfile', {state:{ values: employee}})
    }

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const createdAt = new Date(employee.createdAt);
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
    const isDisabled = date > new Date() || date < new Date(employee.createdAt);
    
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

    useEffect(() => {
        const fetchAttendance = async () => {
          try {
            const res = await axios.get(`http://localhost:8070/api/attendance/user/${userId}`);
            setAttendanceData(res.data.attendance || []);
          } catch (err) {
            console.error('Error fetching attendance:', err);
          } finally {
            setLoading(false);
          }
        };
        fetchAttendance();
      }, [userId]);

    useEffect(() => {

        axios.get(`http://localhost:8070/api/users/getById/${userId}`)
                .then((res)=>{
                    console.log("Données reçues :", res.data);
                    setEmployee(res.data)

                }).catch((err)=>{
                    console.error("Erreur lors de la récupération des employés :", err);

                })
      }, []);


  return (
    <React.Fragment>
                <div className="top">
                    <div className="left">
                    {(currentUser.role ==="ADMIN_HR" || currentUser.role==="MEMBRE_HR")&&<div className="editButton" onClick={()=>handleEdit(userId)}>Edit</div>}
                       <div className="item">
                        <img 
                           src={employee.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600"}
                           alt="" 
                           className="itemImg" 
                        />
                        <div className="details">
                            <h1 className="itemTitle">{employee.firstname + " "+ employee.lastname}</h1>
                            <div className="detailItem">
                                <span className="itemKey">Matricule: </span>
                                <span className="itemValue">{employee.matricule}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Email: </span>
                                <span className="itemValue">{employee.email}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Phone: </span>
                                <span className="itemValue">{employee.phone}</span>
                            </div>
                            {/*role matricule status telephone departement createdAt */}
                            {employee.titulaire && <div className="detailItem">
                                <span className="itemKey">Titulaire: </span>
                                <span className="itemValue">{employee.titulaire}</span>
                            </div>}
                            <div className="detailItem">
                                <span className="itemKey">Status: </span>
                                <span className={`itemValue ${employee.status}`}>{employee.status}</span>
                            </div>
                        </div>
                       </div>
                    </div>
                    <div className="right">
                        {/* <Chart aspect={4} title={"Attendance overview"}/> */}
                        {employee?.skills?.length >0 && employee?.soft_skills_evaluation?.length>0 && <SkillsDisplay
                            skills={employee.skills}
                            soft_skills_evaluation={employee.soft_skills_evaluation}
                        />}
                        
                    </div>
                    
                </div>
                <div className="bottom">
                    <div className="column">
                        {employee?.technical_skills_evaluation &&  employee.technical_skills_evaluation.length>0 &&<SkillRadarChart data={employee.technical_skills_evaluation} />}
                        {/* <List rows={rows} title={titre} catags={[]} type="livrables" /> */}
                    </div>
                    <div className="column">
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
                                view === 'month' && (date > new Date() || date < new Date(employee.createdAt))
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
                                                {/* Left column content (optional): list, soft skills, etc. */}

                    </div>
                </div>
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
    </React.Fragment>
  );
};

export default employeeDetails;
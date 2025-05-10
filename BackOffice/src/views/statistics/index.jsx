import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaUserTag,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaClipboardCheck
} from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './index.scss';
const Statistics = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [statistics, setStatistics] = useState({});
  const [distribution, setDistribution] = useState([]);

  const [loading, setLoading] = useState(true);
  const data = [
    { name: 'In Progress', value: statistics.complaintProgress },
    { name: 'Resolved', value: statistics.complaintResolved },
    { name: 'Pending', value: statistics.complaintPending },
    { name: 'Rejected', value: statistics.complaintRejected }
  ];

  const COLORS = ['#28a745', '#17a2b8', '#ffc107', '#dc3545'];
  const handleGetStatistics = () => {
    axios
      .get('http://localhost:8070/api/statistics/getStatistics')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setStatistics(response.data[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des statistiques :', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetStatistics();
  }, []);

  return (
    <React.Fragment>
      <div className="row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', gap: '10px' }}>
       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '10px', gap: '10px' }}>
       <div
          className="card-user "
          style={{
            padding: 20,
            backgroundColor: '#ffffff',
            width: 290,
            height: 150,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            gap: '4px'
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '920px', gap: '20px' }}>
            <span style={{ color: '#808080', fontSize: '14px', fontWeight: 'bold' }}>
              <FaUser /> Welcome {currentUser.firstname + ' ' +currentUser.lastname }
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#808080', fontSize: '14px' }}>
              <FaEnvelope /> {currentUser.email}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#808080', fontSize: '14px' }}>
              <FaUserTag /> {currentUser.role}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#808080', fontSize: '14px' }}>
              <FaBriefcase /> {currentUser.employmentType}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'green', fontSize: '14px' }}>
              <FaCheckCircle /> {currentUser.status}
            </span>
          </div>
        </div>
        <div
          className="card-user"
          style={{
            padding: 20,
            backgroundColor: '#ffffff',
            width: 290,
            height: 150,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            justifyContent: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaBriefcase style={{ color: '#808080', fontSize: '24px' }} />
            <span style={{ color: '#808080', fontSize: '18px', fontWeight: 'bold' }}>
              Total Complaints: {loading ? 'Loading...' : statistics.complaintTotal}
            </span>
          </div>
        </div>
        <div
          className="card-user "
          style={{
            padding: 20,
            backgroundColor: '#ffffff',
            width: 290,
            height: 150,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            gap: '4px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#808080', fontSize: '14px', fontWeight: 'bold' }}>
              <FaClipboardCheck style={{ color: '#17a2b8' }} /> Complaint in progress: <span style={{ color: '#17a2b8' }}> {statistics.complaintProgress} </span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#808080', fontSize: '14px' , fontWeight: 'bold'}}>
              <FaCheckCircle style={{ color: '#28a745' }} /> Complaint resolved: <span style={{ color: '#28a745' }}> {statistics.complaintResolved}</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#808080', fontSize: '14px' , fontWeight: 'bold'}}>
              <FaHourglassHalf style={{ color: '#ffc107' }} /> Complaint pending: <span style={{ color: '#ffc107' }} >{statistics.complaintPending}</span>  
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#808080', fontSize: '14px' , fontWeight: 'bold'}}>
              <FaTimesCircle style={{ color: '#dc3545' }} /> Complaint rejected: <span style={{ color: '#dc3545' }}>{statistics.complaintRejected}</span> 
            </span>
          </div>
        </div>
        </div>
        <div className="chart-container">
          <div className="chart-inner">
            <h2 className="chart-title">Complaint Status Distribution</h2>
            <div className="chart-box">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Statistics;

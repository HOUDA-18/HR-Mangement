import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const HRLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [employees, setEmployees] = useState({});
  const [error, setError] = useState('');

  const getLeaveColor = (type) => {
    const colors = {
      maternite: '#ff7675',
      sans_solde: '#74b9ff',
      voyage: '#55efc4',
      pending: '#ffeaa7'
    };
    return colors[type] || '#d63031';
  };

  const getCalendarEvents = () => {
    return allLeaves.map(leave => ({
      title: `${employees[leave.id_employee] || 'Unknown'} - ${leave.type}`,
      start: new Date(leave.startDate),
      end: new Date(leave.endDate),
      color: getLeaveColor(leave.status === 'pending' ? 'pending' : leave.type),
      allDay: true,
      extendedProps: {
        status: leave.status,
        reason: leave.reason
      }
    }));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/users');
        const employeeMap = response.data.reduce((acc, user) => {
          acc[user._id] = user.firstname;
          return acc;
        }, {});
        setEmployees(employeeMap);
      } catch (err) {
        setError('Failed to fetch employees');
      }
    };

    const fetchAllLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/conges');
        setAllLeaves(response.data);
      } catch (err) {
        setError('Failed to fetch all leaves');
      }
    };

    fetchEmployees();
    fetchAllLeaves();
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      // Always fetch pending requests
      const response = await axios.get('http://localhost:8070/api/conges?status=pending');
      setLeaves(response.data);
    } catch (err) {
      setError('Failed to fetch leave requests');
    }
  };

  const getNameById = (employeeId) => {
    return employees[employeeId] || 'Unknown Employee';
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await axios.put(`http://localhost:8070/api/conges/${leaveId}/status`, {
        status: newStatus
      });
      // Refresh the list after status change
      fetchLeaves();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>

      <Typography variant="h4" gutterBottom>Leave Management Dashboard</Typography>

      {/* Calendar View */}
      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom>Leave Calendar</Typography>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={getCalendarEvents()}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height={650}
          eventDidMount={(info) => {
            info.el.style.cursor = 'pointer';
            info.el.title = `Status: ${info.event.extendedProps.status}\nReason: ${info.event.extendedProps.reason}`;
          }}
        />
      </Paper>
      <Typography variant="h4" gutterBottom>Pending Leave Requests</Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {leaves.map((leave) => (
          <ListItem key={leave._id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <ListItemText
              primary={`${leave.type} - ${getNameById(leave.id_employee)}`}
              secondary={
                `Submitted: ${new Date(leave.date_soumission).toLocaleDateString()} | ` +
                `From: ${new Date(leave.startDate).toLocaleDateString()} - ` +
                `To: ${new Date(leave.endDate).toLocaleDateString()} | ` +
                `Reason: ${leave.reason}`
              }
            />
            
            <Select
              value={leave.status}
              onChange={(e) => handleStatusChange(leave._id, e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="pending">
                <Chip label="Pending" color="warning" variant="outlined" />
              </MenuItem>
              <MenuItem value="accepted">
                <Chip label="Accept" color="success" variant="outlined" />
              </MenuItem>
              <MenuItem value="rejected">
                <Chip label="Reject" color="error" variant="outlined" />
              </MenuItem>
            </Select>
          </ListItem>
        ))}
      </List>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default HRLeaves;
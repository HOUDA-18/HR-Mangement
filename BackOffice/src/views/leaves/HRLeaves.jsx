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
import axios from 'axios';

const HRLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState({});
  const [error, setError] = useState('');

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

    fetchEmployees();
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
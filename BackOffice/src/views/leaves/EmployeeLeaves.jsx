import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  Button, 
  TextField, 
  MenuItem, 
  Box, 
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const currentUser = JSON.parse(localStorage.getItem("user"));

const LeavesForm = () => {
  const [formData, setFormData] = useState({
    type: 'voyage',
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
    id_employee: currentUser._id,
    date_soumission: new Date(),
    status: 'pending'
  });
  
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Fetch leaves on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/api/conges?id_employee=${currentUser._id}`);
      setLeaves(response.data);
    } catch (err) {
      setError('Failed to fetch leave requests');
    }
  };


  const validateDuration = (startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 20;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.endDate < formData.startDate) {
      setError('End date cannot be before start date');
      return;
    }

    if (!validateDuration(formData.startDate, formData.endDate)) {
      setError('Leave duration cannot exceed 20 days');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/api/conges', formData);
      setError('');
      fetchLeaves(); // Refresh the list after submission
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting request');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/conges/${id}`);
      fetchLeaves(); // Refresh the list after deletion
    } catch (err) {
      setError('Failed to delete leave request');
    }
  };

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setEditOpen(true);
  };

  const handleUpdate = async () => {

    if (formData.endDate < formData.startDate) {
      setError('End date cannot be before start date');
      return;
    }


    if (!validateDuration(formData.startDate, formData.endDate)) {
      setError('Leave duration cannot exceed 20 days');
      return;
    }

    try {
      await axios.put(`http://localhost:8070/api/conges/${selectedLeave._id}`, {
        ...selectedLeave,
        startDate: selectedLeave.startDate,
        endDate: selectedLeave.endDate,
        reason: selectedLeave.reason,
        type: selectedLeave.type
      });
      setEditOpen(false);
      fetchLeaves(); // Refresh the list after update
    } catch (err) {
      setError('Failed to update leave request');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Form Section */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>New Leave Request</Typography>
      <TextField
        select
        fullWidth
        label="Leave Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        sx={{ mb: 2 }}
      >
        <MenuItem value="maternite">Maternité</MenuItem>
        <MenuItem value="sans_solde">Sans Solde</MenuItem>
        <MenuItem value="voyage">Voyage</MenuItem>
      </TextField>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Start Date</Typography>
        <DatePicker
          selected={formData.startDate}
          onChange={(date) => setFormData({ ...formData, startDate: date })}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>End Date</Typography>
        <DatePicker
          selected={formData.endDate}
          onChange={(date) => setFormData({ ...formData, endDate: date })}
          dateFormat="dd/MM/yyyy"
          minDate={formData.startDate}
        />
      </Box>

      <TextField
        fullWidth
        label="Reason"
        multiline
        rows={4}
        value={formData.reason}
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        sx={{ mb: 2 }}
      />

      {/* Hidden employee ID field - should be set from user context */}
      <TextField
        type="hidden"
        value={formData.id_employee}
        // In real app: value={currentUser.id} 
      />

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        size="large"
      >
        Submit Request
      </Button>
      </Box>

      {/* Leaves List Section */}
      <Typography variant="h5" gutterBottom>Your Leave Requests</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {leaves.map((leave) => (
          <ListItem
            key={leave._id}
            secondaryAction={
              <>
                <IconButton 
                  edge="end" 
                  aria-label="edit"
                  onClick={() => handleEdit(leave)}
                  disabled={leave.status !== 'pending'}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleDelete(leave._id)}
                  disabled={leave.status !== 'pending'}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={`${leave.type} • Status: ${leave.status}`}
              secondary={
                `From: ${new Date(leave.startDate).toLocaleDateString()} - ` +
                `To: ${new Date(leave.endDate).toLocaleDateString()} • ` +
                `Reason: ${leave.reason}`
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Leave Request</DialogTitle>
        <DialogContent>
          {selectedLeave && (
            <>
              <TextField
                select
                fullWidth
                label="Leave Type"
                value={selectedLeave.type}
                onChange={(e) => setSelectedLeave({...selectedLeave, type: e.target.value})}
                sx={{ mt: 2 }}
              >
                <MenuItem value="maternite">Maternité</MenuItem>
                <MenuItem value="sans_solde">Sans Solde</MenuItem>
                <MenuItem value="voyage">Voyage</MenuItem>
              </TextField>

              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1">Start Date</Typography>
                <DatePicker
                  selected={new Date(selectedLeave.startDate)}
                  onChange={(date) => setSelectedLeave({...selectedLeave, startDate: date})}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                />
              </Box>

              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1">End Date</Typography>
                <DatePicker
                  selected={new Date(selectedLeave.endDate)}
                  onChange={(date) => setSelectedLeave({...selectedLeave, endDate: date})}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date(selectedLeave.startDate)}
                />
              </Box>

              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={4}
                value={selectedLeave.reason}
                onChange={(e) => setSelectedLeave({...selectedLeave, reason: e.target.value})}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default LeavesForm;
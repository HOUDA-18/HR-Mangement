import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Input,
  Box,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  AutoFixHigh as PredictIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import Stats from './stats';
import OutsideData from './outsideData';
// ==============================|| DASHBOARD ANALYTICS ||============================== //

const Salaries = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedSalary, setEditedSalary] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  const averageSalary = employees.length > 0 
  ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length
  : 0;

  const handlePredictSalary = async (employee) => {
    setPredictionLoading(true);
    try {
      // Prepare prediction data based on your model's requirements
      const predictionData = {
        JobLevel: employee.role === 'EMPLOYEE' ? 1 : 0, // Adjust if other roles exist
        TotalWorkingYears: employee.yearsOfExperience || 0
      };

      const response = await axios.post('http://localhost:5000/predict', predictionData);
      
      // Update the salary input with predicted value
      const integerSalary = Math.floor(response.data.predicted_salary_real);
      setEditedSalary(integerSalary);
      
    } catch (err) {
      setError('Prediction failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setPredictionLoading(false);
    }
  };


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/simple-employees');
        setEmployees(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 3 }}>
        Error loading data: {error}
      </Typography>
    );
  }

  const handleSaveSalary = async (employeeId) => {
    try {
      const response = await axios.post(
        `http://localhost:8070/api/users/simpleupdate/${employeeId}`,
        { salary: parseFloat(editedSalary) }
      );

      // Update local state
      setEmployees(prev => prev.map(emp => 
        emp._id === employeeId ? { ...emp, salary: parseFloat(editedSalary) } : emp
      ));
      
      setSuccessMessage('Salary updated successfully!');
      setEditingId(null);
      setEditedSalary('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update salary');
      setEditingId(null);
      setEditedSalary('');
    }
  };


  return (
    <React.Fragment>
      <h1>Salaries</h1>
      {/* Success/Error messages */}
      {successMessage && (
        <Typography color="success" sx={{ p: 2 }}>
          {successMessage}
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table aria-label="employee table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Salary ($)</TableCell>
              <TableCell>Experience (Years)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee._id} hover>
                  <TableCell>{employee.firstname}</TableCell>
                  <TableCell>{employee.lastname}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    {editingId === employee._id ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Input
                          type="number"
                          value={editedSalary}
                          onChange={(e) => setEditedSalary(e.target.value)}
                          sx={{ width: 100 }}
                        />
                        <Button
                          variant="contained" 
                          color="success" 
                          size="small"
                          startIcon={<PredictIcon />}
                          onClick={() => handlePredictSalary(employee)}
                          disabled={predictionLoading}
                        >
                          {predictionLoading ? <CircularProgress size={20} /> : 'Predict'}
                        </Button>
                        <Button
                          variant="contained" 
                          color="primary" 
                          size="small"
                          startIcon={<SaveIcon />}
                          onClick={() => handleSaveSalary(employee._id)}
                        >
                          Save
                        </Button>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setEditingId(null);
                            setEditedSalary('');
                          }}
                          color="error"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {employee.salary?.toLocaleString() || 'N/A'}
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setEditingId(employee._id);
                            setEditedSalary(employee.salary || '');
                          }}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{employee.yearsOfExperience}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stats salaries={employees.map(e => e.salary).filter(Boolean)} />


      <OutsideData 
        jobTitle="Software Engineer" 
        location="us" 
        internalSalary={averageSalary}
      />  
    </React.Fragment>
  );
};

export default Salaries;
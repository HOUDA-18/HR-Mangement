import React from 'react';
import LeavesForm from './EmployeeLeaves';
import HRLeaves from './HRLeaves';

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      {currentUser.role === 'EMPLOYEE' && <LeavesForm />}
      {currentUser.role === 'HEAD_DEPARTEMENT' && <HRLeaves />}
    </div>
  );
};

export default Dashboard;
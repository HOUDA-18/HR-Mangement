import React from 'react';
import LeavesForm from './EmployeeLeaves';
import HRLeaves from './HRLeaves';

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      {currentUser.role === 'EMPLOYEE' || currentUser.role === 'MEMBRE_HR' && <LeavesForm />}
      {currentUser.role === 'HEAD_DEPARTEMENT' || currentUser.role === 'ADMIN_HR' && <HRLeaves />}
    </div>
  );
};

export default Dashboard;
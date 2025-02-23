import { Add } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';


// ==============================|| DASHBOARD ANALYTICS ||============================== //

const Employees = () => {
  return (
    <React.Fragment>
        <h1>Employees</h1>
        <Link to="add" className="link">
                <Add/>
                  Add employee
        </Link>
    </React.Fragment>
  );
};

export default Employees;
// UserDistributionByDepartment.tsx

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./index.scss";

const UserDistributionByDepartment = () => {
  const [data, setData] = useState([]);

   useEffect(() => {
    // Simulate an API call for department distribution data
  fetch('http://localhost:8070/api/departements')
  .then(res => res.json())
  .then(datas=>{
    const transformedData = datas.map(department => ({
      department: department.name,  // Get the name of the department
      users: department.employees.length,  // Count of employees in the department
    }));
    setData(transformedData)
    console.log("user distribution by role:",datas)
  })
  .catch((err)=>{
    console.log("error:",err)

  })
  }, []); 

  return (
    <div className="bar-chart-container">
      <div className="bar-chart-inner">
        <h2 className="bar-chart-title">User Distribution by Department</h2>
        <div className="bar-chart-box">
          {data.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDistributionByDepartment;

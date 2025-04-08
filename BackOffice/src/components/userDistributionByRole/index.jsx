// UserDistributionChart.tsx

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./index.scss";

const data = [
  { name: "Admin", value: 8 },
  { name: "Editor", value: 12 },
  { name: "Viewer", value: 30 },
  { name: "Guest", value: 5 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];


const UserDistributionChart = () => {
  const [distribution, setDistribution] = useState([])
useEffect(()=>{
  fetch('http://localhost:8070/api/user-distribution')
  .then(res => res.json())
  .then(datas=>{
    setDistribution(datas)
    console.log("user distribution by role:",datas)
  })
  .catch((err)=>{
    console.log("error:",err)

  })
},[])
  return (
    <div className="chart-container">
      <div className="chart-inner">
        <h2 className="chart-title">User Role Distribution</h2>
        <div className="chart-box">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDistributionChart;

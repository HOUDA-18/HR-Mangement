
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./byStatus.scss";

const UserDistributionByStatus = () => {
  const [data, setData] = useState([
  ]);

  useEffect(() => {
    fetch("http://localhost:8070/api/user-status-distribution")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((datas) => {
        setData(datas);
        console.log("User distribution by status:", datas);
      })
      .catch((err) => {
        console.error("API Error:", err.message);
        // Optionally set a fallback state
        setData([]);
      });
  }, []);

  const COLORS = [ "#FF5722", "#FFEB3B", "#4CAF50"]; // Green, Yellow, Red

  return (
    <div className="donut-chart-container">
      <div className="donut-chart-inner">
        <h2 className="donut-chart-title">User Distribution by Status</h2>
        <div className="donut-chart-box">
          {data.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70} // This creates the "donut" effect
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDistributionByStatus;

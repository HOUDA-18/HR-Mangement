/* 
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';  // You can use 'Pie' for a donut chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const UserStatusDistributionChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8070/api/user-status-distribution')
      .then(res => res.json())
      .then(data => {
        // Format the data as per the structure used for the donut chart
        const formattedData = {
          height: 150,
          type: 'donut',
          options: {
            dataLabels: {
              enabled: false
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '75%'
                }
              }
            },
            labels: data.labels, // Status labels from the backend
            legend: {
              show: false
            },
            tooltip: {
              theme: 'light'
            },
            grid: {
              padding: {
                top: 20,
                right: 0,
                bottom: 0,
                left: 0
              }
            },
            colors: ['#ff6384', '#36a2eb'], // Add more colors if you have more statuses
            fill: {
              opacity: [1, 1]
            },
            stroke: {
              width: 0
            }
          },
          series: data.series // Count of active/inactive users
        };

        setChartData(formattedData); // Set the chart data
      })
      .catch(err => console.error('Error fetching user status data:', err));
  }, []);

  return (
    <div className="card">
      <h3 className="card-title">User Status Distribution</h3>
      <div className="card-body" style={{ width: '200px', height: '200px', margin: '0 auto' }}>
        {chartData ? (
          <Pie data={chartData} options={chartData.options} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserStatusDistributionChart;
 */

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

  const COLORS = [ "#FFEB3B","#4CAF50", "#FF5722"]; // Green, Yellow, Red

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

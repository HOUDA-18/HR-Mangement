import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const StatusChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8070/api/user-status-distribution") // Adjust backend URL
      .then((response) => {
        response.data.options.labels = response.data.options.labels || ["Active", "Inactive", "Suspended"];

        // Enable data labels on the pie chart
        response.data.options.dataLabels = {
          enabled: true,
          formatter: (val, { seriesIndex, w }) => {
            return `${w.config.labels[seriesIndex]}: ${val.toFixed(1)}%`; // Label + percentage
          },
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            colors: [ '#ff6384','#2ed8b6', "#000000"]
          }
        };
        setChartData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching status distribution:", error);
      });
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">User Status Distribution</h2>
      {chartData ? (
        <Chart options={chartData.options} series={chartData.series} type="donut" height={150} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StatusChart;

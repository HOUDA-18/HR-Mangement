import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, CircularProgress, Alert } from '@mui/material';

const OutsideData = ({ jobTitle, location, internalSalary }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const encodedTitle = encodeURIComponent(jobTitle.toLowerCase());
        const response = await fetch(
          `http://localhost:5000/api/market-salary?location=${location}&title=${encodedTitle}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch market data');
        }

        const data = await response.json();

        // Calculate monthly average from 12 months
        const total = data.reduce((sum, item) => sum + item.marketAvg, 0);
        const monthlyMarketAvg = total / data.length / 12;
        const monthlyCompanyAvg = internalSalary ;

        setChartData([
          { name: 'Market Average', Market: monthlyMarketAvg },
          { name: 'Your Company Average', Company: monthlyCompanyAvg }
        ]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [jobTitle, location, internalSalary]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, mt: 2, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading market data...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Alert severity="error">
          Error loading market data: {error}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Salary Comparison ({jobTitle} in {location})
      </Typography>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Market" fill="#8884d8" name="Market Average" />
          <Bar dataKey="Company" fill="#82ca9d" name="Your Company Average" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Data source: Adzuna API — average salary for {jobTitle} in {location}
      </Typography>
    </Paper>
  );
};

export default OutsideData;

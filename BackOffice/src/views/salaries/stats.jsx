import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { InfoRounded } from '@mui/icons-material';

const Stats = ({ salaries }) => {
  const { mean, stdDev, distributionData, stats } = useMemo(() => {
    if (!salaries.length) return { mean: 0, stdDev: 0, distributionData: [], stats: {} };

    const validSalaries = salaries
      .map(s => Number(s))
      .filter(s => !isNaN(s))
      .sort((a, b) => a - b);

    const total = validSalaries.length;
    const mean = validSalaries.reduce((a, b) => a + b, 0) / total;
    const stdDev = Math.sqrt(
      validSalaries.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / total
    );
    
    // Calculate quartiles
    const q25 = validSalaries[Math.floor(validSalaries.length * 0.25)];
    const median = validSalaries[Math.floor(validSalaries.length * 0.5)];
    const q75 = validSalaries[Math.floor(validSalaries.length * 0.75)];

    // Generate distribution data
    const distributionData = [];
    if (stdDev > 0) {
      const min = Math.min(...validSalaries);
      const max = Math.max(...validSalaries);
      const step = (max - min)/50 || 1;
      const maxDensity = 1 / (stdDev * Math.sqrt(2 * Math.PI));

      for (let x = min - 3*stdDev; x <= max + 3*stdDev; x += step) {
        const density = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
                       Math.exp(-0.5 * Math.pow((x - mean)/stdDev, 2));
        distributionData.push({ 
          x,
          y: (density / maxDensity) * 100
        });
      }
    }

    return {
      mean,
      stdDev,
      distributionData,
      stats: {
        total,
        min: validSalaries[0],
        max: validSalaries[validSalaries.length - 1],
        q25,
        median,
        q75
      }
    };
  }, [salaries]);

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoRounded color="primary" /> Salary Distribution Analysis
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left Side - Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Key Statistics
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2 }}>
              <StatItem label="Sample Size" value={stats.total} />
              <StatItem label="Mean Salary" value={`$${mean.toFixed(2)}`} />
              <StatItem label="Standard Deviation" value={`$${stdDev.toFixed(2)}`} />
              <StatItem label="Salary Range" value={`$${stats.min?.toFixed(0)} - $${stats.max?.toFixed(0)}`} />
              <StatItem label="25th Percentile" value={`$${stats.q25?.toFixed(0)}`} />
              <StatItem label="Median (50th)" value={`$${stats.median?.toFixed(0)}`} />
              <StatItem label="75th Percentile" value={`$${stats.q75?.toFixed(0)}`} />
            </Box>

            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              * Normal distribution curve shows relative probability density compared to peak value
            </Typography>
          </Paper>
        </Grid>

        {/* Right Side - Chart */}
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={distributionData}
              margin={{ top: 20, right: 30, left: 40, bottom: 40 }} // Added bottom margin
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  type="number"
                  label={{ 
                    value: 'Salary', 
                    position: 'bottom',
                    offset: 20 
                  }}
                  tickFormatter={value => `$${value.toFixed(0)}`}
                />
                <YAxis
                  label={{ 
                    value: 'Relative Probability (%)',
                    angle: -90,
                    position: 'left',
                    offset: 0
                  }}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Probability']}
                  labelFormatter={value => `Salary: $${value.toFixed(0)}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name={`Normal Distribution (μ=$${mean.toFixed(0)}, σ=$${stdDev.toFixed(0)})`}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Reusable statistic component
const StatItem = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Typography variant="body1" component="span" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="body1" component="span" fontWeight="500">
      {value}
    </Typography>
  </Box>
);

export default Stats;
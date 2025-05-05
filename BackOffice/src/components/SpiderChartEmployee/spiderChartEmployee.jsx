import React, { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer
} from 'recharts';

import './spiderChartEmployee.scss'

const SkillRadarChart = ({ data }) => {

    const colorScale = {
        1: '#ef4444',
        2: '#f97316',
        3: '#eab308',
        4: '#10b981',
        5: '#3b82f6',
      };
      
      const averageRating = Math.round(
        data.reduce((sum, d) => sum + d.rating, 0) / data.length
      );
      const color = colorScale[averageRating] || '#64748b';
      
    const ratingScale = {
    "Not experienced": 1,
    "Junior": 2,
    "Intermediate": 3,
    "Advanced": 4,
    "Expert": 5,
    };
    

    const formattedData= data.map(skillEval => ({
    skill: skillEval.skill,
    rating: ratingScale[skillEval.ai_evaluation.rating] || 0,
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="tooltip-box">
              <p><strong>{payload[0].payload.skill}</strong></p>
              <p>Rating: {payload[0].payload.rating}</p>
            </div>
          );
        }
        return null;
      };
    
      return (
        <>
        <h4>Technical Skills Overview</h4>
        <div className="skill-radar-container">
          
        <div className="chart-section">
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" stroke="#374151" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10 }} />
              <Radar name="Skill Level" dataKey="rating" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              <Tooltip content={CustomTooltip}/>
            </RadarChart>
          </ResponsiveContainer> 
        </div>
          
    
          <div className="rating-scale">
            <h5>Rating Scale:</h5>
            <ul>
              <li><span>1:</span> Not Experienced</li>
              <li><span>2:</span> Junior</li>
              <li><span>3:</span> Intermediate</li>
              <li><span>4:</span> Advanced</li>
              <li><span>5:</span> Expert</li>
            </ul>
          </div>
        </div></>
      );
};

export default SkillRadarChart;

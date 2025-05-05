import React from 'react';
import './skillsComponent.scss';

const SkillsDisplay = ({ skills, soft_skills_evaluation }) => {
    const uniqueSkills = [...new Set(skills)].slice(0, 12);
  
    // Rating color mapping
    const ratingColors = {
      A1: '#ff6b6b',
      A2: '#ff9e4f',
      B1: '#ffd166',
      B2: '#06d6a0',
      C1: '#118ab2',
      C2: '#073b4c'
    };
  
    return (
      <div className="skills-compact">
        <h3 className="skills-title">Technical Skills</h3>
        <div className="skills-grid">
          {uniqueSkills.map((skill, index) => (
            <div key={index} className="skill-pill">
              {skill}
            </div>
          ))}
        </div>
        
        <div className="soft-skills">
          <h3 className="skills-title">Language Proficiency</h3>
          <div className="rating-display">
            <span 
              className="rating-badge" 
              style={{ backgroundColor: ratingColors[soft_skills_evaluation[0].ai_evaluation.rating] || '#ccc' }}
            >
              {soft_skills_evaluation[0].ai_evaluation.rating}
            </span>
            <span className="rating-label">English Level</span>
          </div>
        </div>
      </div>
  );
};

export default SkillsDisplay;
import React, { useEffect, useState } from 'react';
import './detailsInterview.scss'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const detailsInterview = () => {

    const [report, setReport]= useState({})

    const location = useLocation();

    const applicationId = location.state?.values;

    useEffect(()=>{
        axios.get(`http://localhost:8070/api/aiInterview/${applicationId}`)
        .then((res)=>{
            console.log("res get application: ",res.data)
            setReport(res.data)

        }).catch((err)=>{
            console.log('err: ',err)
        })
  },[])
  if (!report) return <div className="interview-report">No report available.</div>;

  return (
    <div className="interview-report">
      <h2>{report.interview_name} - Interview Report</h2>
      <div className="candidate-info">
        <p><strong>Candidate:</strong> {report.candidate_name}</p>
        <p><strong>Email:</strong> {report.candidate_email}</p>
        <p><strong>Date:</strong> {new Date(report.report_date).toLocaleString()}</p>
      </div>

      {report.proctoring_score!== null && (
        <div className="proctoring-score">
        <span>Overall Score:</span> 
        <strong className="score">{report.proctoring_score}%</strong>
        </div>
    )}

      <div className="links">
        <a href={report.report_url} target="_blank" rel="noopener noreferrer">View Full Report (PDF)</a>
        <a href={report.interview_recording_url} target="_blank" rel="noopener noreferrer">Watch Interview Recording</a>
      </div>

     <section className="section">
        <h3>Technical Skills Evaluation</h3>
        {report?.technical_skills_evaluation?.map((skillEval) => (
          <div key={skillEval._id} className="evaluation-card">
            <h4>{skillEval.skill}</h4>
            <p><strong>Rating:</strong> {skillEval.ai_evaluation.rating}</p>
            <p>{skillEval.ai_evaluation.feedback}</p>
          </div>
        ))}
      </section> 

       <section className="section">
        <h3>Soft Skills Evaluation</h3>
        {report?.soft_skills_evaluation?.map((skillEval) => (
          <div key={skillEval._id} className="evaluation-card">
            <h4>{skillEval.skill}</h4>
            <p><strong>Rating:</strong> {skillEval.ai_evaluation.rating}</p>
            <p>{skillEval.ai_evaluation.feedback}</p>
          </div>
        ))}
      </section> 

       <section className="section">
        <h3>Transcript</h3>
        <div className="transcript">
          {report?.interview_transcript?.map((entry) => (
            <div key={entry._id} className={`transcript-entry ${entry.role}`}>
              <span className="role">{entry.role === 'interviewer' ? 'AI Interviewer' : 'Candidate'}</span>
              <p>{entry.content}</p>
              <span className="timestamp">{entry.timestamp.toFixed(2)}s</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default detailsInterview;

import React, { useEffect, useState } from "react";
import "./index.scss";
import { useLocation } from "react-router-dom";
import { FaArrowDown, FaFileDownload, FaGithub, FaLinkedinIn } from "react-icons/fa";
import axios from "axios";

const JobApplicationDetails = () => {
    const location = useLocation();

    const applicationId = location.state?.values;

  const [application, setApplication]= useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    skills: [],
    cv: "",
    score: 0,
    lien_linkdin: "",
    lien_git:  "",
    dateApplication:  "",
    status:  "PENDING",
    softwareDomains:  [],
    technicalAssessment: "",
    overallEvaluation: "",
    languages: "",
  })

  useEffect(()=>{
        axios.get(`http://localhost:8070/api/candidatures/${applicationId}`)
        .then((res)=>{
            console.log("res: ",res.data)
            setApplication(res.data)
        }).catch((err)=>{
            console.log('err: ',err)
        })
  },[])

  const downloadCV = (cv) => {
    // Replace with actual URL if hosted somewhere
    const link = document.createElement("a");
    link.href = application.cv;
    link.download = `${application.firstname}_${application.lastname}_CV.pdf`;
    link.click();
  };

  return (
    <div className="job-application-card">
      <h2>{application.firstname} {application.lastname}</h2>
      <p className="status">Status: <span className={application?.status}>{application.status}</span></p>
      <p>📧 {application.email}</p>
      <p>📱 {application.phone}</p>
      <p>📅 Applied on: {new Date(application.dateApplication).toLocaleDateString()}</p>

      <div className="section">
        <h3>Skills</h3>
        {application.skills!=[] &&
        <ul className="skills">
          {application.skills.map(skill => <li key={skill}>{skill}</li>)}
        </ul>}
      </div>

      <div className="section">
        <h3>Languages</h3>
        {application.languages!=[] && <p>{application.languages.join(", ")}</p>}
      </div>

      <div className="section">
        <h3>Links</h3>
        <p><a href={application.lien_linkdin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn/> LinkedIn</a></p>
        <p><a href={application.lien_git} target="_blank" rel="noopener noreferrer"><FaGithub/> GitHub</a></p>
      </div>

      <div className="section">
         <h3>Software Domains</h3>
        {application.softwareDomains.length>0 &&  application.softwareDomains.map(domain => (
          <p key={domain.domain}>{domain.domain} - {domain.score}%</p>
        ))}
      </div>

      <div className="section">
        <h3>Technical Assessment</h3>
        <ul>
          {Object.entries(application.technicalAssessment).map(([key, value]) => (
            <li key={key}><strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}%</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Overall Evaluation</h3>
        <p><strong>Score:</strong> {application.overallEvaluation.overallScore}%</p>
        <p><strong>Strengths:</strong> {application.overallEvaluation.strengths}</p>
        <p><strong>Weaknesses:</strong> {application.overallEvaluation.weaknesses}</p>
      </div>

      <div className="actions">
        <button onClick={downloadCV}><FaFileDownload/> Download CV</button>
      </div>
    </div>
  );
};

export default JobApplicationDetails;
